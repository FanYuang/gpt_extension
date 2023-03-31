import {
    initializeBlock,
    useBase,
    useRecords,
} from '@airtable/blocks/ui';
import React from 'react';
function TodoExtension() {
    const base = useBase();
    const table = base.getTableByName('Tasks');
    const records = useRecords(table);
    const prompt = table.getFieldByName('prompt');
    const role = table.getFieldByName('role');
    const tasks = records.map(record => {
        const value = record.getCellValue(prompt);
        return (
            <div key={record.id}>
                {value || 'Unnamed record'}
            </div>
        );
    });
   
    return (
        <div>{tasks}</div>
    );
}
initializeBlock(() => <TodoExtension />);