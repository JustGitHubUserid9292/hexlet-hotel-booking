import React, { useState } from "react";

const Calendar = ({ checkIn, checkOut, selectDates }) => {
  const today = new Date();
  const currentMonthIndex = today.getMonth();
  const currentYear = today.getFullYear();

  const [monthOffset, setMonthOffset] = useState(0);

  const handleNextMonth = () => {
    setMonthOffset((prev) => (prev + 1 < 12 ? prev + 1 : prev));
  };

  const handlePrevMonth = () => {
    if (monthOffset > 0) {
      setMonthOffset((prev) => prev - 1);
    }
  };

  const months = Array.from({ length: 13 }, (_, i) => {
    const month = new Date(currentYear, currentMonthIndex + i, 1);
    const daysInMonth = new Date(currentYear, currentMonthIndex + i + 1, 0).getDate();
    const startDay = month.getDay();

    const adjustedStartDay = startDay === 0 ? 6 : startDay - 1;

    const days = Array.from({ length: 42 }, (_, dayIndex) => { 
      const day = dayIndex - adjustedStartDay + 1;

      if (day <= 0 || day > daysInMonth) {
        return <div key={dayIndex} className="empty"></div>;
      }

      const date = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const currentDay = new Date();
      const targetDay = new Date(date);
      const isPastDay = targetDay < currentDay && targetDay.getDate() !== currentDay.getDate();
      const isSelected = date === checkIn || date === checkOut ? "selected" : checkIn && checkOut && new Date(date) > new Date(checkIn) && new Date(date) < new Date(checkOut) ? "in-range" : "";

      return (
        <div key={date} className={`day ${isSelected}${isPastDay ? "inactive" : ""}`} onClick={() => !isPastDay && selectDates(date)}>{day}</div>
      );
    });

    return (
      <div key={i} className="month">
        <div className="month-header">
          {i === monthOffset && (<button className="prevMonth" onClick={handlePrevMonth} disabled={monthOffset === 0}><i className="ri-arrow-drop-left-line"></i></button>)}
          <h3>{month.toLocaleString("en-US", { month: "long" })} {month.getFullYear()}</h3>
          {i === monthOffset + 1 && (<button className="nextMonth" onClick={handleNextMonth} disabled={monthOffset === 11}><i className="ri-arrow-drop-right-line"></i></button>)}
        </div>
        <div className="weekdays">
          {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day) => (
            <div key={day} className="weekday">{day}</div>
          ))}
        </div>
        <div className="days-grid">{days}</div>
      </div>
    );
  });

  const getTwoMonths = () => {
    const firstMonth = months[monthOffset];
    const secondMonth = months[monthOffset + 1];
    return (
      <div className="two-months-container">{firstMonth}{secondMonth}</div>
    );
  };

  return (<div className="calendar-container">{getTwoMonths()}</div>
  );
};

export default Calendar;
