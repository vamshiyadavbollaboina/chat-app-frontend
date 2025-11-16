const TableResponse = ({ tabularData }) => {
  if (!tabularData || !tabularData.headers || !tabularData.rows) {
    return null;
  }

  const { headers, rows } = tabularData;

  return (
    <div className="mt-4 overflow-x-auto shadow-lg rounded-xl border border-gray-200 dark:border-gray-700">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className="px-6 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wider dark:text-gray-200"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800">
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700/50 ${
                rowIndex % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800' : ''
              }`}
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    cellIndex === 0
                      ? 'font-medium text-gray-900 dark:text-gray-100'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableResponse;
