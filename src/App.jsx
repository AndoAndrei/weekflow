// App.jsx
// WeekFlow
// Author: Andrei Ando

import React, { useState, useCallback } from 'react';
import DayCard from './components/DayCard';
import AddTaskSheet from './components/AddTaskSheet';
import FAB from './components/FAB';
import DragContext from './components/DragContext';
import useTasks from './hooks/useTasks';
import { getWeekDays, toDateKey, todayKey, weekRangeLabel } from './utils/weekUtils';

const weekDays = getWeekDays();

export default function App() {
  const {
    tasks, addTask, toggleTask, editTask, setComment,
    deleteTask, moveTask, tasksForDay, forceRollover,
  } = useTasks();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetDate, setSheetDate] = useState(todayKey());

  const openAddSheet = useCallback((date) => {
    setSheetDate(date ? toDateKey(date) : todayKey());
    setSheetOpen(true);
  }, []);

  const closeSheet = useCallback(() => setSheetOpen(false), []);

  const handleAdd = useCallback((title, dateKey) => {
    addTask(title, dateKey);
  }, [addTask]);

  return (
    <DragContext onMoveTask={moveTask} weekDays={weekDays}>
      <div
        className="min-h-screen"
        style={{ backgroundColor: '#FFFDF7', fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" }}
      >
        {/* Sticky header */}
        <header
          className="sticky top-0 z-30 px-5"
          style={{
            backgroundColor: 'rgba(255,253,247,0.92)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            paddingTop: 'max(env(safe-area-inset-top), 12px)',
            borderBottom: '0.5px solid #E5E5EA',
          }}
        >
          <div className="max-w-2xl mx-auto pb-3 flex items-end justify-between">
            <div>
              <h1 className="text-3xl font-bold leading-tight" style={{ letterSpacing: '-0.5px' }}>
                This Week
              </h1>
              <p className="text-sm mt-0.5" style={{ color: '#8E8E93' }}>
                {weekRangeLabel()}
              </p>
            </div>
          </div>
        </header>

        {/* Day cards */}
        <main className="max-w-2xl mx-auto px-4 py-4 pb-28 flex flex-col gap-3">
          {weekDays.map((date) => {
            const key = toDateKey(date);
            return (
              <DayCard
                key={key}
                date={date}
                tasks={tasksForDay(key)}
                onToggle={toggleTask}
                onDelete={deleteTask}
                onEdit={editTask}
                onComment={setComment}
                onAddForDay={openAddSheet}
              />
            );
          })}
          <p className="text-center text-xs pt-2 pb-4" style={{ color: '#C7C7CC' }}>
            WeekFlow · Tasks stay on device only
          </p>
        </main>

        <FAB onClick={() => openAddSheet(null)} />

        {sheetOpen && (
          <AddTaskSheet
            defaultDate={sheetDate}
            onAdd={handleAdd}
            onClose={closeSheet}
          />
        )}
      </div>
    </DragContext>
  );
}
