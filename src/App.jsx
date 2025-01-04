import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Trash2, Copy } from 'lucide-react';

const TrainerBookingApp = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookings, setBookings] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  // 產生月曆資料
  const generateCalendar = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const weeks = [];
    let days = [];

    // 填充月初空白
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // 填充日期
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
      if (days.length === 7) {
        weeks.push(days);
        days = [];
      }
    }

    // 填充月底空白
    if (days.length > 0) {
      while (days.length < 7) {
        days.push(null);
      }
      weeks.push(days);
    }

    return weeks;
  };

  // 生成時間選項
  const timeOptions = [];
  for (let i = 14; i <= 21; i++) {
    timeOptions.push(`${i}:00`);
  }

  // 切換月份
  const changeMonth = (offset) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + offset);
    setCurrentDate(newDate);
  };

  // 處理預約提交
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const booking = {
      date: selectedDate,
      time: formData.get('time'),
      trainer: formData.get('trainer'),
      student: formData.get('student'),
      weekday: new Date(selectedDate).toLocaleString('zh-TW', { weekday: 'long' })
    };
    setBookings([...bookings, booking]);
    e.target.reset();
    setSelectedDate(null);
  };

  // 刪除預約
  const deleteBooking = (index) => {
    const newBookings = bookings.filter((_, i) => i !== index);
    setBookings(newBookings);
  };

  // 複製所有預約資料
  const copyAllBookings = () => {
    const text = bookings.map(booking => 
      `${booking.date} ${booking.weekday} ${booking.time} ${booking.trainer} ${booking.student}`
    ).join('\n');
    navigator.clipboard.writeText(text);
  };

  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  return (
    <div className="max-w-lg mx-auto p-4 font-sans">
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {/* 日曆部分 */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <button onClick={() => changeMonth(-1)} className="p-1">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-lg font-semibold">
              {currentDate.getFullYear()}年{currentDate.getMonth() + 1}月
            </span>
            <button onClick={() => changeMonth(1)} className="p-1">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {weekDays.map(day => (
              <div key={day} className="text-center font-medium py-1">{day}</div>
            ))}
            {generateCalendar(currentDate).flat().map((day, index) => (
              <button
                key={index}
                onClick={() => day && setSelectedDate(`${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`)}
                className={`
                  p-2 text-center rounded
                  ${day ? 'hover:bg-blue-100' : 'invisible'}
                  ${selectedDate === `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` ? 'bg-blue-500 text-white' : ''}
                `}
                disabled={!day}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* 預約表單 */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-4">
          <div className="space-y-4">
            <div>
              <label className="block mb-1">預約時間</label>
              <select name="time" required className="w-full p-2 border rounded">
                {timeOptions.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1">學員</label>
              <select name="student" required className="w-full p-2 border rounded">
                <option value="媽咪">媽咪</option>
                <option value="旨吟">旨吟</option>
              </select>
            </div>
            <div>
              <label className="block mb-1">教練</label>
              <select name="trainer" required className="w-full p-2 border rounded">
                <option value="Andy">Andy</option>
                <option value="Adam">Adam</option>
                <option value="Wu">Wu</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={!selectedDate}
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-gray-300"
            >
              新增預約
            </button>
          </div>
        </form>
      </div>

      {/* 預約列表 */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">預約列表</h2>
          <button
            onClick={copyAllBookings}
            className="flex items-center gap-1 text-blue-500 hover:text-blue-600"
          >
            <Copy className="w-4 h-4" />
            複製全部
          </button>
        </div>
        <div className="space-y-2">
          {bookings.map((booking, index) => (
            <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <div className="flex-1">
                {booking.date} {booking.weekday} {booking.time} {booking.trainer} {booking.student}
              </div>
              <button
                onClick={() => deleteBooking(index)}
                className="text-red-500 hover:text-red-600 p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrainerBookingApp;
