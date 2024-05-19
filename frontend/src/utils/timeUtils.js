import timeService from "../services/time.service";

const fetchRemainingTime = async (setId) => {
  try {
    const timeData = await timeService.getTimeById(setId);
    const endTime = new Date(timeData.end_time).getTime();
    const currentTime = new Date().getTime();
    const remainingSeconds = Math.max(
      0,
      Math.floor((endTime - currentTime) / 1000)
    );
    return remainingSeconds;
  } catch (error) {
    console.error("Error fetching time data:", error);
    return null;
  }
};

export { fetchRemainingTime };
