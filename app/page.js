'use client';

import React, { useState, useEffect } from 'react';

// Exercise library organized by muscle group
const exerciseLibrary = {
  chest: [
    'Bench Press', 'Incline Dumbbell Press', 'Dumbbell Fly', 'Cable Crossover', 
    'Push-Ups', 'Decline Bench Press', 'Chest Dips', 'Machine Chest Press'
  ],
  shoulders: [
    'Shoulder Press', 'Lateral Raises', 'Front Raises', 'Rear Delt Fly',
    'Arnold Press', 'Upright Rows', 'Face Pulls', 'Shrugs'
  ],
  triceps: [
    'Triceps Pushdowns', 'Skull Crushers', 'Tricep Dips', 'Overhead Tricep Extension',
    'Close Grip Bench Press', 'Diamond Push-Ups', 'Tricep Kickbacks'
  ],
  back: [
    'Deadlifts', 'Pull-Ups / Lat Pulldown', 'Barbell Rows', 'Seated Cable Rows',
    'T-Bar Rows', 'Single Arm Dumbbell Row', 'Face Pulls', 'Straight Arm Pulldown'
  ],
  biceps: [
    'Bicep Curls', 'Hammer Curls', 'Preacher Curls', 'Concentration Curls',
    'Cable Curls', 'Incline Dumbbell Curls', 'Barbell Curls', 'Chin-Ups'
  ],
  legs: [
    'Squats', 'Leg Press', 'Walking Lunges', 'Calf Raises', 'Romanian Deadlifts',
    'Hamstring Curls', 'Leg Extensions', 'Bulgarian Split Squats', 'Hip Thrusts',
    'Goblet Squats', 'Hack Squats', 'Sumo Deadlifts'
  ],
  core: [
    'Hanging Leg Raises', 'Reverse Lunges', 'Planks', 'Russian Twists',
    'Cable Crunches', 'Ab Wheel Rollouts', 'Leg Raises', 'Dead Bugs'
  ]
};

// Initial program structure
const defaultProgram = {
  'Day 1': {
    name: 'Push (Chest / Shoulders / Triceps)',
    exercises: [
      { id: 1, name: 'Bench Press', targetReps: '8–10', muscleGroup: 'chest' },
      { id: 2, name: 'Shoulder Press', targetReps: '8–10', muscleGroup: 'shoulders' },
      { id: 3, name: 'Incline Dumbbell Press', targetReps: '10–12', muscleGroup: 'chest' },
      { id: 4, name: 'Triceps Pushdowns', targetReps: '12–15', muscleGroup: 'triceps' },
    ]
  },
  'Day 2': {
    name: 'Pull (Back / Biceps)',
    exercises: [
      { id: 5, name: 'Deadlifts', targetReps: '5', muscleGroup: 'back' },
      { id: 6, name: 'Pull-Ups / Lat Pulldown', targetReps: '8–10', muscleGroup: 'back' },
      { id: 7, name: 'Barbell Rows', targetReps: '8–10', muscleGroup: 'back' },
      { id: 8, name: 'Bicep Curls', targetReps: '12–15', muscleGroup: 'biceps' },
    ]
  },
  'Day 3': {
    name: 'Legs (Lower Body)',
    exercises: [
      { id: 9, name: 'Squats', targetReps: '6–8', muscleGroup: 'legs' },
      { id: 10, name: 'Leg Press', targetReps: '10–12', muscleGroup: 'legs' },
      { id: 11, name: 'Walking Lunges', targetReps: '16–20 steps', muscleGroup: 'legs' },
      { id: 12, name: 'Calf Raises', targetReps: '12–15', muscleGroup: 'legs' },
    ]
  },
  'Day 4': {
    name: 'Pull (Posterior / Core)',
    exercises: [
      { id: 13, name: 'Romanian Deadlifts', targetReps: '8–10', muscleGroup: 'legs' },
      { id: 14, name: 'Hamstring Curls', targetReps: '12–15', muscleGroup: 'legs' },
      { id: 15, name: 'Reverse Lunges', targetReps: '8–10 / leg', muscleGroup: 'core' },
      { id: 16, name: 'Hanging Leg Raises', targetReps: '8–12', muscleGroup: 'core' },
    ]
  }
};

// Default empty history
const defaultHistory = {
  naomi: {},
  pedro: {}
};

export default function WorkoutTracker() {
  const [currentDay, setCurrentDay] = useState('Day 1');
  const [program, setProgram] = useState(defaultProgram);
  const [history, setHistory] = useState(defaultHistory);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [view, setView] = useState('workout');
  const [swappingExercise, setSwappingExercise] = useState(null);
  const [addingExercise, setAddingExercise] = useState(false);
  const [addingExerciseDay, setAddingExerciseDay] = useState(null);
  const [editingSet, setEditingSet] = useState(null);
  const [tempInput, setTempInput] = useState({ weight: '', reps: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState('saved');
  
  const [sessionData, setSessionData] = useState({
    naomi: {},
    pedro: {}
  });

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedProgram = localStorage.getItem('liftlog-program');
      const savedHistory = localStorage.getItem('liftlog-history');
      const savedWeek = localStorage.getItem('liftlog-week');

      if (savedProgram) setProgram(JSON.parse(savedProgram));
      if (savedHistory) setHistory(JSON.parse(savedHistory));
      if (savedWeek) setCurrentWeek(parseInt(savedWeek));
    } catch (error) {
      console.log('No saved data found, using defaults');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save program changes
  useEffect(() => {
    if (isLoading) return;
    setSaveStatus('saving');
    try {
      localStorage.setItem('liftlog-program', JSON.stringify(program));
      setSaveStatus('saved');
    } catch (error) {
      setSaveStatus('error');
    }
  }, [program, isLoading]);

  // Save history changes
  useEffect(() => {
    if (isLoading) return;
    setSaveStatus('saving');
    try {
      localStorage.setItem('liftlog-history', JSON.stringify(history));
      setSaveStatus('saved');
    } catch (error) {
      setSaveStatus('error');
    }
  }, [history, isLoading]);

  // Save week changes
  useEffect(() => {
    if (isLoading) return;
    try {
      localStorage.setItem('liftlog-week', currentWeek.toString());
    } catch (error) {
      console.error('Failed to save week:', error);
    }
  }, [currentWeek, isLoading]);

  const workout = program[currentDay];
  const days = Object.keys(program);

  const getLastSession = (person, exerciseName) => {
    const exerciseHistory = history[person]?.[exerciseName];
    if (exerciseHistory && exerciseHistory.length > 0) {
      return exerciseHistory[exerciseHistory.length - 1];
    }
    return null;
  };

  const handleSetClick = (person, exerciseId, setIndex) => {
    const key = `${person}-${exerciseId}-${setIndex}`;
    const existingData = sessionData[person]?.[`${exerciseId}-${setIndex}`];
    setTempInput({
      weight: existingData?.weight?.toString() || '',
      reps: existingData?.reps?.toString() || ''
    });
    setEditingSet({ person, exerciseId, setIndex, key });
  };

  const saveSet = () => {
    if (!editingSet) return;
    const { person, exerciseId, setIndex } = editingSet;
    const weight = parseFloat(tempInput.weight) || 0;
    const reps = parseInt(tempInput.reps) || 0;
    
    setSessionData(prev => ({
      ...prev,
      [person]: {
        ...prev[person],
        [`${exerciseId}-${setIndex}`]: { weight, reps }
      }
    }));

    const exercise = workout.exercises.find(e => e.id === exerciseId);
    if (exercise) {
      const today = new Date().toISOString().split('T')[0];
      
      setHistory(prev => {
        const personHistory = prev[person] || {};
        const exerciseHistory = personHistory[exercise.name] || [];
        
        const todayIndex = exerciseHistory.findIndex(h => h.date === today);
        
        if (todayIndex >= 0) {
          const updatedSets = [...exerciseHistory[todayIndex].sets];
          updatedSets[setIndex] = { weight, reps };
          const updatedEntry = { ...exerciseHistory[todayIndex], sets: updatedSets };
          const updatedExerciseHistory = [...exerciseHistory];
          updatedExerciseHistory[todayIndex] = updatedEntry;
          
          return {
            ...prev,
            [person]: {
              ...personHistory,
              [exercise.name]: updatedExerciseHistory
            }
          };
        } else {
          const newSets = [null, null, null];
          newSets[setIndex] = { weight, reps };
          const newEntry = { date: today, sets: newSets };
          
          return {
            ...prev,
            [person]: {
              ...personHistory,
              [exercise.name]: [...exerciseHistory, newEntry]
            }
          };
        }
      });
    }

    setEditingSet(null);
    setTempInput({ weight: '', reps: '' });
  };

  const getSetData = (person, exerciseId, setIndex) => {
    return sessionData[person]?.[`${exerciseId}-${setIndex}`];
  };

  const swapExercise = (exerciseId, newExerciseName, muscleGroup) => {
    setProgram(prev => ({
      ...prev,
      [currentDay]: {
        ...prev[currentDay],
        exercises: prev[currentDay].exercises.map(ex =>
          ex.id === exerciseId ? { ...ex, name: newExerciseName } : ex
        )
      }
    }));
    setSwappingExercise(null);
  };

  const addExercise = (exerciseName, muscleGroup) => {
    const newId = Math.max(...Object.values(program).flatMap(d => d.exercises.map(e => e.id))) + 1;
    setProgram(prev => ({
      ...prev,
      [currentDay]: {
        ...prev[currentDay],
        exercises: [
          ...prev[currentDay].exercises,
          { id: newId, name: exerciseName, targetReps: '8–12', muscleGroup }
        ]
      }
    }));
    setAddingExercise(false);
    setAddingExerciseDay(null);
  };

  const getRecommendedGroups = (dayName) => {
    const name = dayName.toLowerCase();
    if (name.includes('push') && name.includes('chest')) {
      return ['chest', 'shoulders', 'triceps'];
    } else if (name.includes('pull') && name.includes('back')) {
      return ['back', 'biceps'];
    } else if (name.includes('legs') || name.includes('lower')) {
      return ['legs'];
    } else if (name.includes('posterior') || name.includes('core')) {
      return ['legs', 'core'];
    }
    return [];
  };

  const removeExercise = (exerciseId) => {
    setProgram(prev => ({
      ...prev,
      [currentDay]: {
        ...prev[currentDay],
        exercises: prev[currentDay].exercises.filter(ex => ex.id !== exerciseId)
      }
    }));
  };

  // Workout View
  const WorkoutView = () => (
    <div className="pb-24">
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 -mx-4 px-4">
        {days.map(day => (
          <button
            key={day}
            onClick={() => setCurrentDay(day)}
            className={`flex-shrink-0 px-5 py-3 rounded-2xl font-semibold text-sm transition-all ${
              currentDay === day
                ? 'bg-amber-400 text-stone-900'
                : 'bg-stone-800 text-stone-400'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      <div className="mb-6 flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-stone-100 mb-1">{currentDay}</h2>
          <p className="text-stone-500">{workout.name}</p>
        </div>
        <button
          onClick={() => {
            setAddingExercise(true);
            setAddingExerciseDay(workout.name);
          }}
          className="p-3 rounded-2xl bg-amber-400 text-stone-900 hover:bg-amber-300 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      <div className="space-y-4">
        {workout.exercises.map(exercise => {
          const naomiLast = getLastSession('naomi', exercise.name);
          const pedroLast = getLastSession('pedro', exercise.name);
          
          return (
            <div key={exercise.id} className="bg-stone-800/50 rounded-3xl p-5 border border-stone-700/50">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-stone-100">{exercise.name}</h3>
                  <p className="text-stone-500 text-sm">Target: {exercise.targetReps} reps</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSwappingExercise(exercise)}
                    className="p-2 rounded-xl bg-stone-700/50 text-stone-400 hover:bg-stone-700"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </button>
                  <button
                    onClick={() => removeExercise(exercise.id)}
                    className="p-2 rounded-xl bg-stone-700/50 text-stone-400 hover:bg-red-500/20 hover:text-red-400"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-center mb-2">
                    <span className="text-xs font-bold text-pink-400 uppercase tracking-wider">Naomi</span>
                    {naomiLast && (
                      <p className="text-xs text-stone-500">Last: {naomiLast.sets[0]?.weight}lb</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    {[0, 1, 2].map(setIndex => {
                      const setData = getSetData('naomi', exercise.id, setIndex);
                      return (
                        <button
                          key={setIndex}
                          onClick={() => handleSetClick('naomi', exercise.id, setIndex)}
                          className={`w-full py-3 px-3 rounded-xl text-sm font-medium transition-all ${
                            setData
                              ? 'bg-pink-500/20 border-2 border-pink-500/50 text-pink-300'
                              : 'bg-stone-700/50 border-2 border-stone-600/50 text-stone-400'
                          }`}
                        >
                          {setData ? `${setData.weight}lb × ${setData.reps}` : `Set ${setIndex + 1}`}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <div className="text-center mb-2">
                    <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">Pedro</span>
                    {pedroLast && (
                      <p className="text-xs text-stone-500">Last: {pedroLast.sets[0]?.weight}lb</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    {[0, 1, 2].map(setIndex => {
                      const setData = getSetData('pedro', exercise.id, setIndex);
                      return (
                        <button
                          key={setIndex}
                          onClick={() => handleSetClick('pedro', exercise.id, setIndex)}
                          className={`w-full py-3 px-3 rounded-xl text-sm font-medium transition-all ${
                            setData
                              ? 'bg-sky-500/20 border-2 border-sky-500/50 text-sky-300'
                              : 'bg-stone-700/50 border-2 border-stone-600/50 text-stone-400'
                          }`}
                        >
                          {setData ? `${setData.weight}lb × ${setData.reps}` : `Set ${setIndex + 1}`}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        <button
          onClick={() => {
            setAddingExercise(true);
            setAddingExerciseDay(workout.name);
          }}
          className="w-full py-4 rounded-3xl border-2 border-dashed border-stone-700 text-stone-500 hover:border-amber-400/50 hover:text-amber-400 transition-all flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Exercise
        </button>
      </div>
    </div>
  );

  // Library View
  const LibraryView = () => {
    const [searchQuery, setSearchQuery] = useState('');
    
    const relevantGroups = swappingExercise 
      ? [swappingExercise.muscleGroup]
      : Object.keys(exerciseLibrary);

    const recommendedGroups = addingExerciseDay ? getRecommendedGroups(addingExerciseDay) : [];

    const allExercises = Object.entries(exerciseLibrary).flatMap(([group, exercises]) =>
      exercises.map(name => ({ name, group }))
    );

    const filteredExercises = searchQuery.trim()
      ? allExercises.filter(ex => 
          ex.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          (!swappingExercise || ex.group === swappingExercise.muscleGroup)
        )
      : null;

    const suggestions = searchQuery.trim() && searchQuery.length >= 2
      ? allExercises
          .filter(ex => 
            ex.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
            (!swappingExercise || ex.group === swappingExercise.muscleGroup)
          )
          .slice(0, 5)
      : [];

    const handleExerciseSelect = (exerciseName, muscleGroup) => {
      if (swappingExercise) {
        swapExercise(swappingExercise.id, exerciseName, muscleGroup);
        setView('workout');
      } else if (addingExercise) {
        addExercise(exerciseName, muscleGroup);
        setView('workout');
      }
    };

    const handleClose = () => {
      setView('workout');
      setSwappingExercise(null);
      setAddingExercise(false);
      setAddingExerciseDay(null);
    };

    const sortedGroups = addingExercise && recommendedGroups.length > 0
      ? [...recommendedGroups, ...relevantGroups.filter(g => !recommendedGroups.includes(g))]
      : relevantGroups;

    return (
      <div className="pb-24">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={handleClose}
            className="p-2 rounded-xl bg-stone-800 text-stone-400"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h2 className="text-xl font-bold text-stone-100">
              {swappingExercise 
                ? `Replace ${swappingExercise.name}` 
                : addingExercise 
                  ? `Add Exercise to ${currentDay}`
                  : 'Exercise Library'}
            </h2>
            {swappingExercise && (
              <p className="text-stone-500 text-sm">Choose a {swappingExercise.muscleGroup} exercise</p>
            )}
            {addingExercise && (
              <p className="text-stone-500 text-sm">Choose any exercise to add</p>
            )}
          </div>
        </div>

        <div className="relative mb-6">
          <div className="relative">
            <svg 
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search exercises..."
              className="w-full bg-stone-800 border-2 border-stone-700 rounded-2xl pl-12 pr-4 py-3 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400/50 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full bg-stone-700 text-stone-400 hover:bg-stone-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-stone-800 border-2 border-stone-700 rounded-2xl overflow-hidden z-10 shadow-xl">
              {suggestions.map((exercise, index) => (
                <button
                  key={`${exercise.name}-${index}`}
                  onClick={() => handleExerciseSelect(exercise.name, exercise.group)}
                  className="w-full text-left px-4 py-3 flex justify-between items-center hover:bg-stone-700/50 transition-colors border-b border-stone-700/50 last:border-b-0"
                >
                  <span className="text-stone-200">{exercise.name}</span>
                  <span className="text-xs text-stone-500 capitalize bg-stone-700/50 px-2 py-1 rounded-lg">{exercise.group}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {filteredExercises ? (
          <div>
            <p className="text-sm text-stone-500 mb-3">{filteredExercises.length} results</p>
            <div className="space-y-2">
              {filteredExercises.map((exercise, index) => (
                <button
                  key={`${exercise.name}-${index}`}
                  onClick={() => handleExerciseSelect(exercise.name, exercise.group)}
                  className="w-full text-left p-4 rounded-2xl bg-stone-800/50 border-2 border-stone-700/50 text-stone-300 hover:border-stone-600 transition-all flex justify-between items-center"
                >
                  <span>{exercise.name}</span>
                  <span className="text-xs text-stone-500 capitalize">{exercise.group}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {addingExercise && recommendedGroups.length > 0 && (
              <div className="mb-4 p-3 rounded-2xl bg-amber-400/10 border border-amber-400/20">
                <p className="text-amber-400 text-sm font-medium">
                  💡 Recommended for {addingExerciseDay}: {recommendedGroups.map(g => g.charAt(0).toUpperCase() + g.slice(1)).join(', ')}
                </p>
              </div>
            )}
            {sortedGroups.map(group => {
              const isRecommended = recommendedGroups.includes(group);
              return (
                <div key={group} className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="text-sm font-bold text-stone-500 uppercase tracking-wider capitalize">{group}</h3>
                    {isRecommended && addingExercise && (
                      <span className="text-xs bg-amber-400/20 text-amber-400 px-2 py-0.5 rounded-full font-medium">
                        Recommended
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    {exerciseLibrary[group].map(exerciseName => (
                      <button
                        key={exerciseName}
                        onClick={() => handleExerciseSelect(exerciseName, group)}
                        className={`w-full text-left p-4 rounded-2xl transition-all ${
                          swappingExercise?.name === exerciseName
                            ? 'bg-amber-400/20 border-2 border-amber-400/50 text-amber-300'
                            : isRecommended && addingExercise
                              ? 'bg-amber-400/5 border-2 border-amber-400/20 text-stone-200 hover:border-amber-400/40'
                              : 'bg-stone-800/50 border-2 border-stone-700/50 text-stone-300 hover:border-stone-600'
                        }`}
                      >
                        {exerciseName}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    );
  };

  // History View
  const HistoryView = () => (
    <div className="pb-24">
      <h2 className="text-xl font-bold text-stone-100 mb-6">History</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-pink-500/10 rounded-2xl p-4 border border-pink-500/20">
          <p className="text-pink-400 font-bold text-lg">Naomi</p>
          <p className="text-stone-500 text-sm">{Object.keys(history.naomi || {}).length} exercises tracked</p>
        </div>
        <div className="bg-sky-500/10 rounded-2xl p-4 border border-sky-500/20">
          <p className="text-sky-400 font-bold text-lg">Pedro</p>
          <p className="text-stone-500 text-sm">{Object.keys(history.pedro || {}).length} exercises tracked</p>
        </div>
      </div>

      <div className="space-y-3">
        {Object.keys(history.naomi || {}).length === 0 && Object.keys(history.pedro || {}).length === 0 ? (
          <div className="text-center py-12">
            <p className="text-stone-500">No workout history yet.</p>
            <p className="text-stone-600 text-sm">Start logging sets to see your progress!</p>
          </div>
        ) : (
          [...new Set([...Object.keys(history.naomi || {}), ...Object.keys(history.pedro || {})])].map(exerciseName => {
            const naomiData = history.naomi?.[exerciseName]?.[history.naomi[exerciseName].length - 1];
            const pedroData = history.pedro?.[exerciseName]?.[history.pedro[exerciseName].length - 1];
            return (
              <div key={exerciseName} className="bg-stone-800/50 rounded-2xl p-4 border border-stone-700/50">
                <h3 className="font-bold text-stone-200 mb-2">{exerciseName}</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-pink-400">Naomi: </span>
                    <span className="text-stone-400">
                      {naomiData?.sets?.[0] ? `${naomiData.sets[0].weight}lb × ${naomiData.sets[0].reps}` : '—'}
                    </span>
                  </div>
                  <div>
                    <span className="text-sky-400">Pedro: </span>
                    <span className="text-stone-400">
                      {pedroData?.sets?.[0] ? `${pedroData.sets[0].weight}lb × ${pedroData.sets[0].reps}` : '—'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-stone-700">
        <p className="text-stone-500 text-sm mb-3">Reset all data and start fresh</p>
        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to reset all data? This cannot be undone.')) {
              setProgram(defaultProgram);
              setHistory(defaultHistory);
              setCurrentWeek(1);
              setSessionData({ naomi: {}, pedro: {} });
              localStorage.removeItem('liftlog-program');
              localStorage.removeItem('liftlog-history');
              localStorage.removeItem('liftlog-week');
            }
          }}
          className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm hover:bg-red-500/20 transition-all"
        >
          Reset All Data
        </button>
      </div>
    </div>
  );

  // Progress View
  const ProgressView = () => {
    const exercisesWithHistory = [...new Set([
      ...Object.keys(history.naomi || {}),
      ...Object.keys(history.pedro || {})
    ])];

    const [selectedExercise, setSelectedExercise] = useState(exercisesWithHistory[0] || 'Bench Press');

    const getStats = (person) => {
      const personHistory = history[person] || {};
      let totalVolume = 0;
      let totalSessions = 0;
      let prs = {};

      Object.entries(personHistory).forEach(([exercise, sessions]) => {
        sessions.forEach(session => {
          totalSessions++;
          session.sets.forEach(set => {
            if (set) totalVolume += (set.weight || 0) * (set.reps || 0);
          });
          const validSets = session.sets.filter(s => s && s.weight);
          if (validSets.length > 0) {
            const maxWeight = Math.max(...validSets.map(s => s.weight));
            if (!prs[exercise] || maxWeight > prs[exercise]) {
              prs[exercise] = maxWeight;
            }
          }
        });
      });

      return { totalVolume, totalSessions, prs };
    };

    const naomiStats = getStats('naomi');
    const pedroStats = getStats('pedro');

    const getChartData = (exerciseName) => {
      const naomiExercise = history.naomi?.[exerciseName] || [];
      const pedroExercise = history.pedro?.[exerciseName] || [];
      
      const allDates = [...new Set([
        ...naomiExercise.map(s => s.date),
        ...pedroExercise.map(s => s.date)
      ])].sort();

      return allDates.map(date => {
        const naomiSession = naomiExercise.find(s => s.date === date);
        const pedroSession = pedroExercise.find(s => s.date === date);
        const naomiValidSets = naomiSession?.sets?.filter(s => s && s.weight) || [];
        const pedroValidSets = pedroSession?.sets?.filter(s => s && s.weight) || [];
        return {
          date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          naomi: naomiValidSets.length > 0 ? Math.max(...naomiValidSets.map(s => s.weight)) : null,
          pedro: pedroValidSets.length > 0 ? Math.max(...pedroValidSets.map(s => s.weight)) : null,
        };
      });
    };

    const chartData = getChartData(selectedExercise);
    const maxWeight = Math.max(...chartData.map(d => Math.max(d.naomi || 0, d.pedro || 0)), 1);

    const MiniChart = ({ data, dataKey, color, maxVal }) => {
      const validData = data.filter(d => d[dataKey] !== null);
      if (validData.length < 2) return <p className="text-stone-500 text-sm text-center py-4">Need more data</p>;

      const width = 280;
      const height = 120;
      const padding = 20;
      const chartWidth = width - padding * 2;
      const chartHeight = height - padding * 2;

      const points = validData.map((d, i) => ({
        x: padding + (i / (validData.length - 1)) * chartWidth,
        y: height - padding - (d[dataKey] / maxVal) * chartHeight,
        value: d[dataKey],
        date: d.date
      }));

      const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

      return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-32">
          {[0, 0.5, 1].map((ratio, i) => (
            <line key={i} x1={padding} y1={height - padding - ratio * chartHeight} x2={width - padding} y2={height - padding - ratio * chartHeight} stroke="#44403c" strokeWidth="1" strokeDasharray="4 4" />
          ))}
          <path d={pathD} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          {points.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="6" fill={color} />
              <circle cx={p.x} cy={p.y} r="3" fill="#1c1917" />
            </g>
          ))}
          {points.map((p, i) => (
            <text key={`label-${i}`} x={p.x} y={height - 4} textAnchor="middle" className="fill-stone-500" fontSize="10">{p.date}</text>
          ))}
        </svg>
      );
    };

    return (
      <div className="pb-24">
        <h2 className="text-xl font-bold text-stone-100 mb-6">Progress</h2>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-gradient-to-br from-pink-500/20 to-pink-600/10 rounded-2xl p-4 border border-pink-500/20">
            <p className="text-pink-400 font-bold text-sm mb-1">Naomi</p>
            <p className="text-2xl font-black text-stone-100">{(naomiStats.totalVolume / 1000).toFixed(1)}k</p>
            <p className="text-stone-500 text-xs">total lbs lifted</p>
          </div>
          <div className="bg-gradient-to-br from-sky-500/20 to-sky-600/10 rounded-2xl p-4 border border-sky-500/20">
            <p className="text-sky-400 font-bold text-sm mb-1">Pedro</p>
            <p className="text-2xl font-black text-stone-100">{(pedroStats.totalVolume / 1000).toFixed(1)}k</p>
            <p className="text-stone-500 text-xs">total lbs lifted</p>
          </div>
        </div>

        {exercisesWithHistory.length > 0 ? (
          <>
            <div className="mb-4">
              <label className="block text-sm text-stone-500 mb-2">Select Exercise</label>
              <select
                value={selectedExercise}
                onChange={(e) => setSelectedExercise(e.target.value)}
                className="w-full bg-stone-800 border-2 border-stone-700 rounded-2xl px-4 py-3 text-stone-100 focus:outline-none focus:border-amber-400/50"
              >
                {exercisesWithHistory.map(exercise => (
                  <option key={exercise} value={exercise}>{exercise}</option>
                ))}
              </select>
            </div>

            <div className="bg-stone-800/50 rounded-2xl p-4 border border-stone-700/50 mb-4">
              <h3 className="font-bold text-stone-200 mb-1">Weight Progression</h3>
              <p className="text-stone-500 text-sm mb-4">Max weight per session</p>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-3 h-3 rounded-full bg-pink-400"></span>
                    <span className="text-sm text-stone-400">Naomi</span>
                  </div>
                  <MiniChart data={chartData} dataKey="naomi" color="#f472b6" maxVal={maxWeight * 1.1} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-3 h-3 rounded-full bg-sky-400"></span>
                    <span className="text-sm text-stone-400">Pedro</span>
                  </div>
                  <MiniChart data={chartData} dataKey="pedro" color="#38bdf8" maxVal={maxWeight * 1.1} />
                </div>
              </div>
            </div>

            <div className="bg-stone-800/50 rounded-2xl p-4 border border-stone-700/50">
              <h3 className="font-bold text-stone-200 mb-4">Personal Records 🏆</h3>
              <div className="space-y-3">
                {exercisesWithHistory.slice(0, 5).map(exercise => (
                  <div key={exercise} className="flex items-center justify-between">
                    <span className="text-stone-400 text-sm truncate flex-1 mr-4">{exercise}</span>
                    <div className="flex gap-4">
                      <div className="text-right">
                        <span className="text-pink-400 font-bold">{naomiStats.prs[exercise] || '—'}</span>
                        <span className="text-stone-600 text-xs ml-1">lb</span>
                      </div>
                      <div className="text-right min-w-[60px]">
                        <span className="text-sky-400 font-bold">{pedroStats.prs[exercise] || '—'}</span>
                        <span className="text-stone-600 text-xs ml-1">lb</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-stone-500">No progress data yet.</p>
            <p className="text-stone-600 text-sm">Start logging workouts to see your charts!</p>
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-900 text-stone-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-black tracking-tight mb-4">
            <span className="text-amber-400">LIFT</span>
            <span className="text-stone-500">LOG</span>
          </h1>
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100">
      <div className="bg-stone-900/95 backdrop-blur-lg sticky top-0 z-40 border-b border-stone-800">
        <div className="px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-black tracking-tight">
                <span className="text-amber-400">LIFT</span>
                <span className="text-stone-500">LOG</span>
              </h1>
              <div className="flex items-center gap-2">
                <p className="text-xs text-stone-600">Week {currentWeek} of 12</p>
                {saveStatus === 'saving' && <span className="text-xs text-amber-400">Saving...</span>}
                {saveStatus === 'saved' && <span className="text-xs text-green-500">✓ Saved</span>}
                {saveStatus === 'error' && <span className="text-xs text-red-400">Save failed</span>}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <button onClick={() => setCurrentWeek(w => Math.max(1, w - 1))} className="p-1 rounded-lg bg-stone-800 text-stone-400 hover:bg-stone-700">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <span className="text-xs text-stone-400 w-16 text-center">Week {currentWeek}</span>
                <button onClick={() => setCurrentWeek(w => Math.min(12, w + 1))} className="p-1 rounded-lg bg-stone-800 text-stone-400 hover:bg-stone-700">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-pink-400"></span>
                <span className="w-2 h-2 rounded-full bg-sky-400"></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6">
        {view === 'workout' && !swappingExercise && !addingExercise && <WorkoutView />}
        {(view === 'library' || swappingExercise || addingExercise) && <LibraryView />}
        {view === 'history' && <HistoryView />}
        {view === 'progress' && <ProgressView />}
      </div>

      {editingSet && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end">
          <div className="bg-stone-800 w-full rounded-t-3xl p-6 pb-10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-stone-100">
                Log Set {editingSet.setIndex + 1}
                <span className={`ml-2 text-sm ${editingSet.person === 'naomi' ? 'text-pink-400' : 'text-sky-400'}`}>
                  ({editingSet.person})
                </span>
              </h3>
              <button onClick={() => setEditingSet(null)} className="p-2 rounded-xl bg-stone-700 text-stone-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm text-stone-500 mb-2">Weight (lb)</label>
                <input
                  type="number"
                  inputMode="decimal"
                  value={tempInput.weight}
                  onChange={(e) => setTempInput(prev => ({ ...prev, weight: e.target.value }))}
                  className="w-full bg-stone-700 rounded-2xl px-4 py-4 text-2xl font-bold text-center text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder="0"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm text-stone-500 mb-2">Reps</label>
                <input
                  type="number"
                  inputMode="numeric"
                  value={tempInput.reps}
                  onChange={(e) => setTempInput(prev => ({ ...prev, reps: e.target.value }))}
                  className="w-full bg-stone-700 rounded-2xl px-4 py-4 text-2xl font-bold text-center text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder="0"
                />
              </div>
            </div>

            <button onClick={saveSet} className="w-full bg-amber-400 text-stone-900 font-bold py-4 rounded-2xl text-lg">
              Save Set
            </button>
          </div>
        </div>
      )}

      {!editingSet && !swappingExercise && !addingExercise && (
        <div className="fixed bottom-0 left-0 right-0 bg-stone-900/95 backdrop-blur-lg border-t border-stone-800">
          <div className="flex justify-around py-3 pb-6">
            <button onClick={() => setView('workout')} className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${view === 'workout' ? 'text-amber-400' : 'text-stone-600'}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              <span className="text-xs font-medium">Workout</span>
            </button>
            <button onClick={() => setView('progress')} className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${view === 'progress' ? 'text-amber-400' : 'text-stone-600'}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              <span className="text-xs font-medium">Progress</span>
            </button>
            <button onClick={() => setView('library')} className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${view === 'library' ? 'text-amber-400' : 'text-stone-600'}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              <span className="text-xs font-medium">Library</span>
            </button>
            <button onClick={() => setView('history')} className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${view === 'history' ? 'text-amber-400' : 'text-stone-600'}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span className="text-xs font-medium">History</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
