import { fetchRemainingTime } from "./timeUtils";

const [remainingTime, setRemainingTime] = useState(null);

useEffect(() => {
  // Fetch remaining time separately
  fetchRemainingTime(1).then((remainingTime) => {
    setRemainingTime(remainingTime);
  });
}, []);
