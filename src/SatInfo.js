const SATInfo = ({satData}) => {

    return (
        <div className="sat">
        <div className="sat-content">
          <h2>SAT Results:</h2>
          {satData ? (
            <>
              <p>Math Avg. Score: {satData.sat_math_avg_score}</p>
              <p>Critical Reading Avg. Score: {satData.sat_critical_reading_avg_score}</p>
              <p>Writing Avg. Score: {satData.sat_writing_avg_score}</p>
            </>
          ) : (
            <p>No Data</p>
          )}
        </div>
      </div>
    );
};

export default SATInfo