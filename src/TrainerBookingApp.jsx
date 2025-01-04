import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Trash, Copy } from 'lucide-react';

const TrainerBookingApp = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookings, setBookings] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('14:00');
  const [selectedTrainer, setSelectedTrainer] = useState('Andy');
  const [selectedStudent, setSelectedStudent] = useState('媽咪');

  // 生成時間選項 (14:00-20:00)
  const timeOptions = Array.from({ length: 7 }, (_, i) => {
    const hour = i + 14;
    return `${hour}:00`;
  });

  // 生成日曆數據
  const generateCalendarDays = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDay = firstDay.getDay();
    const totalDays = lastDay.getDate();

    const days = [];
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= totalDays; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  // 獲取星期幾的中文名稱
  const getWeekdayName = (date) => {
    const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
    return weekdays[date.getDay()];
  };

  // 處理月份切換
  const changeMonth = (delta) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + delta);
    setCurrentDate(newDate);
  };

  // 處理預約提交
  const handleBooking = () => {
    if (!selectedDate) return;
    
    const newBooking = {
      id: Date.now(),
      date: selectedDate,
      weekday: getWeekdayName(selectedDate),
      time: selectedTime,
      trainer: selectedTrainer,
      student: selectedStudent
    };
    
    setBookings([...bookings, newBooking]);
  };

  // 處理刪除預約
  const deleteBooking = (id) => {
    setBookings(bookings.filter(booking => booking.id !== id));
  };

  // 複製所有預約資料
  const copyAllBookings = () => {
    const text = bookings.map(booking => 
      `${booking.date.toLocaleDateString('zh-TW')} ${booking.weekday} ${booking.time} ${booking.trainer} ${booking.student}`
    ).join('\n');
    
    navigator.clipboard.writeText(text);
  };

  // 格式化預約顯示文字
  const formatBookingText = (booking) => {
    return `${booking.date.toLocaleDateString('zh-TW')} ${booking.weekday} ${booking.time} ${booking.trainer} ${booking.student}`;
  };

  return (
    <div className="max-w-md mx-auto p-4 font-sans">
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 日曆部分 */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <button onClick={() => changeMonth(-1)} className="p-1">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-bold">
              {currentDate.getFullYear()}年{currentDate.getMonth() + 1}月
            </span>
            <button onClick={() => changeMonth(1)} className="p-1">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {['日', '一', '二', '三', '四', '五', '六'].map(day => (
              <div key={day} className="text-sm font-medium">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {generateCalendarDays(currentDate).map((date, index) => (
              <button
                key={index}
                className={`
                  p-2 text-center text-sm rounded
                  ${!date ? 'invisible' : ''}
                  ${date && selectedDate && date.toDateString() === selectedDate.toDateString()
                    ? 'bg-blue-500 text-white'
                    : 'hover:bg-gray-100'}
                `}
                onClick={() => date && setSelectedDate(date)}
                disabled={!date}
              >
                {date ? date.getDate() : ''}
              </button>
            ))}
          </div>
        </div>

        {/* 預約表單 */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">時間</label>
              <select
                className="w-full p-2 border rounded"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
              >
                {timeOptions.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">學員</label>
              <select
                className="w-full p-2 border rounded"
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
              >
                <option value="媽咪">媽咪</option>
                <option value="姐姐">姐姐</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">教練</label>
              <select
                className="w-full p-2 border rounded"
                value={selectedTrainer}
                onChange={(e) => setSelectedTrainer(e.target.value)}
              >
                <option value="Andy">Andy</option>
                <option value="Adam">Adam</option>
                <option value="g">g</option>
                <option value="🐯">🐯</option>
              </select>
            </div>
            
            <button
              onClick={handleBooking}
              disabled={!selectedDate}
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-300"
            >
              新增預約
            </button>
          </div>
        </div>
      </div>

      {/* 預約列表 */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="space-y-2">
          {bookings.map(booking => (
            <div key={booking.id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
              <div className="text-sm font-mono">
                {formatBookingText(booking)}
              </div>
              <button
                onClick={() => deleteBooking(booking.id)}
                className="text-red-500 hover:text-red-600"
              >
                <Trash className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        
        {bookings.length > 0 && (
          <button
            onClick={copyAllBookings}
            className="mt-4 w-full flex items-center justify-center gap-2 bg-gray-100 p-2 rounded hover:bg-gray-200"
          >
            <Copy className="w-4 h-4" />
            <span>複製所有預約</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default TrainerBookingApp;
