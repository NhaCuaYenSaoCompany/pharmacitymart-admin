/**
 * Utility function to check if a route pattern matches current path
 * Handles both exact matches and dynamic routes (e.g., /permission-management/:roleId)
 */
export const isRouteMatch = (routePath: string, currentPath: string): boolean => {
  // Handle exact match first
  if (routePath === currentPath) {
    return true;
  }
  
  // Handle dynamic routes (e.g., /permission-management/:roleId)
  if (routePath.includes(':')) {
    const routeSegments = routePath.split('/');
    const currentSegments = currentPath.split('/');
    
    // Must have same number of segments
    if (routeSegments.length !== currentSegments.length) {
      return false;
    }
    
    // Check each segment
    for (let i = 0; i < routeSegments.length; i++) {
      const routeSegment = routeSegments[i];
      const currentSegment = currentSegments[i];
      
      // If it's a parameter (starts with :), skip the check
      if (routeSegment.startsWith(':')) {
        continue;
      }
      
      // If it's not a parameter, must match exactly
      if (routeSegment !== currentSegment) {
        return false;
      }
    }
    
    return true;
  }
  
  return false;
};
