import React from 'react';
// import { Card } from 'primereact/card';
// import { Chart } from 'primereact/chart';
// import { Divider } from 'primereact/divider';
// import 'chart.js/auto';
// import { PowerBIEmbed } from 'powerbi-client-react';
// import { models } from 'powerbi-client';
const Dashboard: React.FC = () => {


  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <div className="p-4 mt-[30px]"></div>
      <iframe
        title="Reporte Power BI"
        width="100%"
        height="100%"
        src="https://app.powerbi.com/view?r=eyJrIjoiMTcxNTY3MzktMDM0NS00OTdlLTkwMmItNjg5MTQwZmZiZjJiIiwidCI6IjVmNTNiNGNlLTYzZDQtNGVlOC04OGQyLTIyZjBiMmQ0YjI3YSIsImMiOjR9"
        frameBorder="0"
        allowFullScreen={true}
      />
    </div>

  );
};

export default Dashboard;
