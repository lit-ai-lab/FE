import React from 'react';

const RegionTaskTable = ({ region, tasks }) => {
    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-800">{region}</h3>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full">
            <thead>
                <tr className="bg-gray-25">
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                    순위
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    분야 - 업무명
                </th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {tasks.map((task) => (
                <tr key={task.rank} className="hover:bg-gray-25 transition-colors duration-150">
                    <td className="px-4 py-2 text-sm font-medium text-gray-900 text-center">
                    {task.rank}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                    {task.category} - {task.name}
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
    </div>
    );
};

export default React.memo(RegionTaskTable);