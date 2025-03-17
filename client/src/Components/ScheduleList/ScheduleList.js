import React, { useState } from 'react';
import './ScheduleList.css';

const ScheduleList = () => {
  const [portOfLoad, setPortOfLoad] = useState('');
  const [portOfDischarge, setPortOfDischarge] = useState('');
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    // In a real application, you would fetch data from an API here
    // For this example, we'll use mock data
    const mockSchedules = [
      {
        id: 1,
        service: 'Silk Service',
        departure: '2023-05-01',
        arrival: '2023-05-15',
        vesselVoyageNo: 'MSC GÜLSÜN / AB123',
        estimatedTransitTime: '14 days',
        portOfLoad: 'Shanghai',
        portOfDischarge: 'Rotterdam',
        estimatedTimeOfArrival: '2023-05-15 08:00',
        estimatedTimeOfDeparture: '2023-05-01 10:00',
      },
      {
        id: 2,
        service: 'Dragon Service',
        departure: '2023-05-03',
        arrival: '2023-05-18',
        vesselVoyageNo: 'MSC OSCAR / CD456',
        estimatedTransitTime: '15 days',
        portOfLoad: 'Shanghai',
        portOfDischarge: 'Rotterdam',
        estimatedTimeOfArrival: '2023-05-18 14:00',
        estimatedTimeOfDeparture: '2023-05-03 09:00',
      },
    ];
    setSchedules(mockSchedules);
  };

  const handleScheduleClick = (schedule) => {
    setSelectedSchedule(schedule);
  };

  return (
    <div className="schedule-list">
      <h2>Search Schedules</h2>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Port of Load"
          value={portOfLoad}
          onChange={(e) => setPortOfLoad(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Port of Discharge"
          value={portOfDischarge}
          onChange={(e) => setPortOfDischarge(e.target.value)}
          required
        />
        <button type="submit">Search</button>
      </form>

      {schedules.length > 0 && (
        <>
          <h3>
            Schedules from {portOfLoad} to {portOfDischarge}
          </h3>
          <table>
            <thead>
              <tr>
                <th>Service</th>
                <th>Departure</th>
                <th>Arrival</th>
                <th>Vessel / Voyage No.</th>
                <th>Est. Transit Time</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((schedule) => (
                <tr key={schedule.id} onClick={() => handleScheduleClick(schedule)}>
                  <td>{schedule.service}</td>
                  <td>{schedule.departure}</td>
                  <td>{schedule.arrival}</td>
                  <td>{schedule.vesselVoyageNo}</td>
                  <td>{schedule.estimatedTransitTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {selectedSchedule && (
        <div className="schedule-details">
          <h3>Schedule Details</h3>
          <p><strong>Service:</strong> {selectedSchedule.service}</p>
          <p><strong>Port of Load:</strong> {selectedSchedule.portOfLoad}</p>
          <p><strong>Port of Discharge:</strong> {selectedSchedule.portOfDischarge}</p>
          <p><strong>Estimated Time of Departure:</strong> {selectedSchedule.estimatedTimeOfDeparture}</p>
          <p><strong>Estimated Time of Arrival:</strong> {selectedSchedule.estimatedTimeOfArrival}</p>
          <p><strong>Vessel / Voyage No.:</strong> {selectedSchedule.vesselVoyageNo}</p>
          <p><strong>Estimated Transit Time:</strong> {selectedSchedule.estimatedTransitTime}</p>
        </div>
      )}
    </div>
  );
};

export default ScheduleList;
