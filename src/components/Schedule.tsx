import { useEffect, useState } from "react";
import "./Schedule.css";

interface Times {
  active: Boolean;
  row: string[];
}
interface ScheduleDays {
  headers: string[];
  scheduleTime: Times[];
}

interface DayData {
  today: string;
  index: number;
  dayYear: number;
  todaySchedule: string[];
}

interface TodaySchedule {
  morning: string[];
  afternoon: string[];
}
const Schedule = () => {
  const [scheduleDays, setScheduleDays] = useState<ScheduleDays>({
    headers: [],
    scheduleTime: [],
  });

  const [dayData, setDayData] = useState<DayData>({
    today: "",
    index: 0,
    dayYear: 0,
    todaySchedule: [],
  });

  const [todaySchedule, setTodaySchedule] = useState<TodaySchedule>({
    morning: [],
    afternoon: [],
  });

  const getHeaders = (array: string[]): string[] => {
    let headers: string[];
    const csvRowFormatted: string[] = [
      ...array[0].replace("\n", "").split(","),
    ];
    headers = csvRowFormatted;
    return headers;
  };

  const getBody = (array: string[]): Times[] => {
    let body = [];
    for (let i = 1; i < array.length - 1; i++) {
      const csvRowFormatted = array[i].replace("\n", "").split(",");
      const times = {
        active: csvRowFormatted[0].toLowerCase() === "true",
        row: csvRowFormatted.slice(1, csvRowFormatted.length),
      };
      body.push(times);
    }
    return body;
  };

  const setSchedule = async () => {
    fetch(
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vRHtpHw_j11VIqhKxtGObVGlFuEU5NPm2JP6_huBd5IFIoXdd9T6YryaZStHuK3QjNX47zOuaIXuYoM/pub?output=csv"
    )
      .then((response) => response.text())
      .then((data) => {
        let array = [];
        array = data.split("\r");
        const headers = getHeaders(array);
        setScheduleDays({
          headers: headers,
          scheduleTime: getBody(array),
        });
      });
  };

  const dayNumberInTheYear = (date: any): number => {
    const fullYear: number = date.getFullYear();
    const dateYear: any = new Date(fullYear, 0, 0);
    const result: number = Math.floor(
      (date - dateYear) / (1000 * 60 * 60 * 24)
    );
    return result;
  };

  const setDay = () => {
    const date = new Date();
    const dayText = new Intl.DateTimeFormat("es-ES", {
      weekday: "long",
    }).format(date);
    const dayTextUpper: string = dayText.toUpperCase();
    let headers = [...scheduleDays.headers];
    const index = headers.indexOf(dayTextUpper);
    setDayData({
      ...dayData,
      today: dayTextUpper,
      index: index,
      dayYear: dayNumberInTheYear(date),
    });
  };

  useEffect(() => {
    const settingDays = () => {
      setSchedule();
    };
    settingDays();
    return () => {};
  }, []);

  useEffect(() => {
    setDay();
  }, [scheduleDays.headers, scheduleDays.scheduleTime]);

  useEffect(() => {
    const schedulng = async () => {
      if (dayData.index !== -1 && dayData.index !== 0) {
        const schedule = scheduleDays.scheduleTime.filter((time) => {
          if (Boolean(time.active)) {
            return time.row[dayData.index];
          }
        });

        let morning: string[] = [];
        let afternoon: string[] = [];
        for (let i = 0; i < schedule.length; i++) {
          if (schedule[i].row[dayData.index].toLowerCase() === "true") {
            if (schedule[i].row[1].includes("a.m")) {
              morning.push(schedule[i].row[1]);
            } else if (schedule[i].row[1].includes("p.m")) {
              afternoon.push(schedule[i].row[1]);
            }
          }
        }

        setTodaySchedule({ morning, afternoon });
      }
    };
    schedulng();
  }, [dayData.index]);

  return (
    <>
      <h1 className="day-schedule">{dayData.today}</h1>
      <div className="hour-list">
        <div className="hour-list-morning">
          {todaySchedule.morning.map((hour, index) => (
            <p key={index} className="hour">
              {hour}
            </p>
          ))}
        </div>
        <div className="hour-list-afternoon">
          {todaySchedule.afternoon.map((hour, index) => (
            <p key={index} className="hour">
              {hour}
            </p>
          ))}
        </div>
      </div>
    </>
  );
};

export default Schedule;
