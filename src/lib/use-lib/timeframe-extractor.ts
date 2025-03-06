/**
 * Creates a function to extract time frame parameters from URL search params
 *
 * @param selectedTimeFrame - The selected time frame from URL parameters
 * @returns A function that extracts section-specific time frames
 */
export function createTimeFrameExtractor(selectedTimeFrame?: string) {
  return function extractTimeFrame(sectionKey: string): string | undefined {
    if (!selectedTimeFrame) {
      return undefined;
    }

    // Check if the time frame is section-specific
    if (selectedTimeFrame.includes(':')) {
      const [key, value] = selectedTimeFrame.split(':');

      // If the key matches the requested section, return the value
      if (key === sectionKey) {
        return `${key}:${value}`;
      }

      // Otherwise, return undefined (use default)
      return undefined;
    }

    // If it's a global time frame, apply it to all sections
    return `${sectionKey}:${selectedTimeFrame}`;
  };
}