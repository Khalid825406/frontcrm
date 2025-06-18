import React from 'react';
import '../components/AssignedJobs.css';

const StatusTimeline = ({ timeline, job }) => {
  const latestStatus = timeline.length > 0 ? timeline[timeline.length - 1].status : 'Assigned';

  const isRejected = latestStatus === 'Rejected';
  const statusSteps = isRejected
    ? ['Assigned', 'Rejected']
    : ['Assigned', 'Accepted', 'In Progress', 'Completed'];

  const getStatusClass = (status) => {
    if (status === 'Assigned') return 'completed';
    const index = timeline.findIndex((t) => t.status === status);
    if (index !== -1 && status === 'Rejected') return 'rejected';
    return index !== -1 ? 'completed' : 'pending';
  };

  const getTimestamp = (status) => {
    const item = timeline.find((t) => t.status === status);
    return item?.timestamp
      ? new Date(item.timestamp).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
      : '';
  };

  const getReason = (status) => {
    const item = timeline.find((t) => t.status === status);
    return item?.reason || '';
  };

  const isCompleted = (status) => getStatusClass(status) === 'completed';

  return (
    <div className="timeline-container">
      {statusSteps.map((status, index) => (
        <div key={status} className="timeline-step-wrapper">
          <div className={`timeline-step ${getStatusClass(status)}`}>
            <div
              className={`circle ${getStatusClass(status) === 'completed' ? 'circle-active' : ''
                } ${getStatusClass(status) === 'rejected' ? 'circle-rejected' : ''}`}
            >
              {getStatusClass(status) === 'completed' ? '✓' : ''}
              {getStatusClass(status) === 'rejected' ? '✕' : ''}
            </div>

            <div className="label">{status}</div>
            <div className="timestamp">{getTimestamp(status)}</div>

            {status === 'Rejected' && getReason(status) && (
              <div className="reason">Reason: {getReason(status)}</div>
            )}

            {status === 'In Progress' && job?.startWork && (
              <div className="timeline-img-remarks">
                {job.startWork.image && (
                  <img
                    src={job.startWork.image}
                    alt="Start Work"
                    className="timeline-img"
                  />
                )}
                {job.startWork.remark && ( 
                  <div><strong>Remark:</strong> {job.startWork.remark}</div>
                )}
              </div>
            )}

            {status === 'Completed' && job?.completion && (
              <div className="timeline-img-remarks">
                {job.completion.image && (
                  <img
                    src={job.startWork.image}
                    alt="Start Work"
                    className="timeline-img"
                  />
                )}
                {job.completion.remark && ( // ✅ FIXED
                  <div><strong>Remark:</strong> {job.completion.remark}</div>
                )}
              </div>
            )}

          </div>

          {index !== statusSteps.length - 1 && (
            <div className={`line ${isCompleted(status) ? 'line-active' : ''}`} />
          )}
        </div>
      ))}
    </div>
  );
};

export default StatusTimeline;
