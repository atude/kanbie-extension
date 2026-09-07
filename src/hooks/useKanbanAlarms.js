/* global chrome */
import { useState, useEffect, useCallback } from 'react';
import moment from 'moment';
import { updateBadge } from '../utils/badge';

export function useKanbanAlarms(initialAlarms = {}) {
  const [alarms, setAlarms] = useState(initialAlarms);

  // Sync scheduled chrome.alarms whenever alarms state changes
  useEffect(() => {
    const syncWithChromeAlarms = async () => {
      try {
        if (typeof chrome !== 'undefined' && chrome.alarms) {
          await chrome.alarms.clearAll();
          Object.keys(alarms).forEach((alarmId) => {
            if (!alarms[alarmId]?.notified && alarms[alarmId]?.alarmDue) {
              chrome.alarms.create(alarmId, {
                when: new Date(alarms[alarmId].alarmDue).getTime(),
              });
            }
          });
        }
      } catch (error) {
        console.warn('Error syncing chrome alarms:', error);
      }
    };

    syncWithChromeAlarms();
    updateBadge(alarms);
  }, [alarms]);

  // Clean up alarms whose cards have been removed from the board
  const cleanOrphanedAlarms = useCallback((columns) => {
    setAlarms((prevAlarms) => {
      const allCardIds = new Set();
      columns.forEach((column) => {
        column.items.forEach((card) => allCardIds.add(card.id));
      });

      const nextAlarms = {};
      let changed = false;
      Object.keys(prevAlarms).forEach((cardId) => {
        if (allCardIds.has(cardId)) {
          nextAlarms[cardId] = prevAlarms[cardId];
        } else {
          changed = true;
        }
      });

      return changed ? nextAlarms : prevAlarms;
    });
  }, []);

  const addOrEditAlarm = useCallback((cardId, dateAlarm, timeAlarm) => {
    if (dateAlarm && timeAlarm) {
      const alarmDue = moment(`${dateAlarm} ${timeAlarm}`, 'DD/MM/YYYY HH:mm');
      if (alarmDue.isValid()) {
        setAlarms((prev) => ({
          ...prev,
          [cardId]: {
            alarmDue: alarmDue.toISOString(false),
            notified: false,
          },
        }));
      } else {
        console.warn(`Invalid alarm time: ${dateAlarm} ${timeAlarm}`);
      }
    } else {
      setAlarms((prev) => {
        if (!prev[cardId]) return prev;
        const { [cardId]: _, ...remaining } = prev;
        return remaining;
      });
    }
  }, []);

  const removeAlarm = useCallback((cardId) => {
    setAlarms((prev) => {
      if (!prev[cardId]) return prev;
      const { [cardId]: _, ...remaining } = prev;
      return remaining;
    });
  }, []);

  return {
    alarms,
    setAlarms,
    cleanOrphanedAlarms,
    addOrEditAlarm,
    removeAlarm,
  };
}

export default useKanbanAlarms;

