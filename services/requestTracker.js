const requestLimits = {}; 

const MONTHLY_LIMIT = 15; 

exports.trackRequest = (userId) => {
  if (!requestLimits[userId]) {
    requestLimits[userId] = 0;
  }
  requestLimits[userId] += 1;
};

exports.getUsagePercentage = (userId) => {
  const used = requestLimits[userId] || 0;
  return Math.min((used / MONTHLY_LIMIT) * 100, 100); 
};

exports.getRemainingRequests = (userId) => {
  return MONTHLY_LIMIT - (requestLimits[userId] || 0);
};