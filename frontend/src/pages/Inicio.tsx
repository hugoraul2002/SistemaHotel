import React from 'react';
// import { Card } from 'primereact/card';
// import { Chart } from 'primereact/chart';
// import { Divider } from 'primereact/divider';
// import 'chart.js/auto';
// import { PowerBIEmbed } from 'powerbi-client-react';
// import { models } from 'powerbi-client';
const Dashboard: React.FC = () => {


  return (
    <div className="w-full h-full">
      {/* <PowerBIEmbed
        embedConfig={{
          type: 'report',   // Supported types: report, dashboard, tile, visual, qna, paginated report and create
          id: '<Report Id>',
          embedUrl: '<Embed Url>',
          accessToken: '<Access Token>',
          tokenType: models.TokenType.Embed, // Use models.TokenType.Aad for SaaS embed
          settings: {
            panes: {
              filters: {
                expanded: false,
                visible: false
              }
            },
            background: models.BackgroundType.Transparent,
          }
        }}

        eventHandlers={
          new Map([
            ['loaded', function () { console.log('Report loaded'); }],
            ['rendered', function () { console.log('Report rendered'); }],
            ['error', function (event) { console.log(event.detail); }],
            ['visualClicked', () => console.log('visual clicked')],
            ['pageChanged', (event) => console.log(event)],
          ])
        }

        cssClassName={"reportClass"}

        getEmbeddedComponent={(embeddedReport) => {
          this.report = embeddedReport as Report;
        }}
      /> */}
      <iframe title="DashboardHotel" width="100%" height="700px"  src="https://app.powerbi.com/reportEmbed?reportId=bba4b9a9-247f-4b74-88e9-26d485a075ae&autoAuth=true&ctid=5f53b4ce-63d4-4ee8-88d2-22f0b2d4b27a" frameBorder="0" allowFullScreen={true}></iframe>
    </div>
  );
};

export default Dashboard;
