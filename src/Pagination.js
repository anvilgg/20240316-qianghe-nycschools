
const Pagination = ({ totalItems, itemsPerPage, currentPage, paginate }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
  
    return (
      <nav>
        <ul className="pagination">
          <li className={`page-nav ${currentPage === 1 ? 'disabled' : ''}`}>
            <button onClick={() => paginate(currentPage - 1)} className="page-nav-button" disabled={currentPage === 1}>
              &lt;
            </button>
          </li>
          <li className="page-info">
            Page {currentPage} of {totalPages}
          </li>
          <li className={`page-nav ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button onClick={() => paginate(currentPage + 1)} className="page-nav-button" disabled={currentPage === totalPages}>
              &gt;
            </button>
          </li>
        </ul>
      </nav>
    );
  };

export default Pagination;