import {
    initializeBlock,
    useBase,
    useRecords,
    updateRecordAsync ,
    Button,
    Input
} from '@airtable/blocks/ui';



import React , { useState } from 'react';
const { Configuration, OpenAIApi } = require("openai");


function TodoExtension() {
    const [apiKey, setApiKey] = useState('');
    const base = useBase();
    const table = base.getTableByName('Tasks');
    const records = useRecords(table);
    const prompt = table.getFieldByName('prompt');
    const role = table.getFieldByName('role');
   
    async function updateresult()
    {
        const configuration = new Configuration({
            apiKey: apiKey,
          });
        const openai = new OpenAIApi(configuration);
       for (let record of records)
       {
        const p_value = record.getCellValue(prompt);
        const r_value = record.getCellValue(role);
        const completion = await openai.createCompletion({
            model: "gpt-3.5-turbo",
            prompt:p_value
          });
       
        table.updateRecordAsync(record, {'result': completion.data.choices[0].text});
        
    }
    }
    return (
        <div>
            <Input type="text" placeholder="API Key" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
            <Button onClick={() => updateresult()} icon="edit">
                Button
            </Button>
        </div>
    );
}
initializeBlock(() => <TodoExtension />);