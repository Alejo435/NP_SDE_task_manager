import { useMemo, useState } from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { COLUMNS, isStatus } from "../lib/columns";
import type { Status, Task } from "../types";
import Column from "./Column";
import TaskCard from "./TaskCard";
import ErrorState from "./Error";

// Interface for recieving tasks and load/error updates from App.tsx
interface Props {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  //functions for reporting actions back to the App
  onRetry: () => void;
  onCreate: (title: string, status: Status) => void;
  onMove: (id: string, patch: { status: Status; position: number }) => void;
}

export default function Board({
  tasks,
  loading,
  error,
  onRetry,
  onCreate,
  onMove,
}: Props) {
    
  // these 2 consts track which task is being dragged and over which column it is
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overColumn, setOverColumn] = useState<Status | null>(null);

  // sets how much mouse movement causes drag to begin (need to set so click doesnt drag but opens desc)
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 6 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // sort tasks by position and sorts them into lookup baseed on status (Highest peirority comes first)
  const byColumn = useMemo(() => {
    const map = Object.fromEntries(
      COLUMNS.map((c) => [c.id, [] as Task[]]),
    ) as Record<Status, Task[]>;
    for (const t of [...tasks].sort((a, b) => a.position - b.position))
      map[t.status].push(t);
    return map;
  }, [tasks]);

  //   when drop target can be column or card, turns either into status
  const columnOf = (id: UniqueIdentifier): Status | undefined =>
    isStatus(id) ? id : tasks.find((t) => t.id === id)?.status;

  //   object for card beigng draged
  const activeTask = tasks.find((t) => t.id === activeId) ?? null;

  const reset = () => {
    setActiveId(null);
    setOverColumn(null);
  };

  function handleDragStart({ active }: DragStartEvent) {
    setActiveId(String(active.id));
  }

  function handleDragOver({ over }: DragOverEvent) {
    setOverColumn(over ? (columnOf(over.id) ?? null) : null);
  }

  //  finds target column of active card and where it should land. djusts by 1 when moving down same column.
  //  active cards ps becomes midpoint of 2 neighbords
  function handleDragEnd({ active, over }: DragEndEvent) {
    reset();
    if (!over || active.id === over.id) return;
    const task = tasks.find((t) => t.id === active.id);
    const target = columnOf(over.id);
    if (!task || !target) return;

    const original = byColumn[target];
    const list = original.filter((t) => t.id !== task.id);
    const droppedOnColumn = isStatus(over.id);

    let index = droppedOnColumn
      ? list.length
      : list.findIndex((t) => t.id === over.id);
    // Moving down within the same column: land after the card you dropped on
    if (
      task.status === target &&
      !droppedOnColumn &&
      original.findIndex((t) => t.id === task.id) <
        original.findIndex((t) => t.id === over.id)
    ) {
      index += 1;
    }

    const prev = list[index - 1]?.position;
    const next = list[index]?.position;
    const position =
      prev === undefined && next === undefined
        ? 1000
        : prev === undefined
          ? next! - 1000
          : next === undefined
            ? prev + 1000
            : (prev + next) / 2;

    onMove(task.id, { status: target, position });
  }

  if (error && tasks.length === 0) {
    return (
      <ErrorState title="Tasks didn't load" detail={error} onRetry={onRetry} />
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={reset}
    >
      <div className="flex h-full snap-x gap-4 overflow-x-auto p-6">
        {COLUMNS.map((col) => (
          <Column
            key={col.id}
            column={col}
            tasks={byColumn[col.id]}
            loading={loading}
            highlighted={overColumn === col.id && activeTask?.status !== col.id}
            onAdd={(title) => onCreate(title, col.id)}
          />
        ))}
      </div>
      <DragOverlay dropAnimation={{ duration: 180, easing: "ease-out" }}>
        {activeTask && <TaskCard task={activeTask} overlay />}
      </DragOverlay>
    </DndContext>
  );
}
