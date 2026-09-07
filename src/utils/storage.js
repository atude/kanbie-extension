/* global chrome */

/**
 * Safely retrieves stored data from chrome.storage.sync with fallback for web/local development.
 */
export const getStorageData = async (keys) => {
  try {
    if (typeof chrome !== 'undefined' && chrome.storage?.sync) {
      const data = await chrome.storage.sync.get(keys);
      if (chrome.runtime?.error) {
        throw new Error(chrome.runtime.error);
      }
      return data;
    }
  } catch (error) {
    console.warn('Error reading from chrome.storage.sync. Using local memory fallback.', error);
  }
  return {};
};

/**
 * Safely saves data to chrome.storage.sync with fallback for web/local development.
 */
export const setStorageData = async (data) => {
  try {
    if (typeof chrome !== 'undefined' && chrome.storage?.sync) {
      await chrome.storage.sync.set(data);
      if (chrome.runtime?.error) {
        console.warn('Runtime error saving data to chrome.storage.sync');
      }
    }
  } catch (error) {
    console.warn('Error saving to chrome.storage.sync', error);
  }
};

