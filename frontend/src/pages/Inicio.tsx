import React from 'react';
import { Card } from 'primereact/card';
import { Chart } from 'primereact/chart';
import { Divider } from 'primereact/divider';
import 'chart.js/auto';

const Dashboard: React.FC = () => {
  const barData = {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
    datasets: [
      {
        label: 'Reservaciones',
        backgroundColor: '#42A5F5',
        data: [65, 59, 80, 81, 56, 55]
      },
      {
        label: 'Hospedajes',
        backgroundColor: '#66BB6A',
        data: [28, 48, 40, 19, 86, 27]
      }
    ]
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  const stats = [
    { label: 'Habitaciones', value: 120, icon: 'pi pi-home', color: 'bg-blue-500' },
    { label: 'Clientes', value: 450, icon: 'pi pi-users', color: 'bg-orange-500' },
    { label: 'Hospedajes', value: 300, icon: 'pi pi-bed', color: 'bg-green-500' },
    { label: 'Monto en Ventas', value: 'Q25,000', icon: 'pi pi-dollar', color: 'bg-teal-500' },
    { label: 'Reservaciones', value: 75, icon: 'pi pi-calendar', color: 'bg-pink-500' }
  ];
  
  return (
    <div className="p-grid p-align-center">
      <div className="p-col-12">
        <div className="p-grid">
          {stats.map((stat, index) => (
            <div key={index} className="p-col-12 p-md-6 p-lg-3">
              <Card className={`shadow-2 ${stat.color} text-white`}>
                <div className="p-d-flex p-jc-between p-ai-center">
                  <div>
                    <span className="block text-2xl font-medium">{stat.value}</span>
                    <span className="block text-sm">{stat.label}</span>
                  </div>
                  <div className="p-text-right">
                    <i className={`${stat.icon} text-4xl`}></i>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>

      <div className="p-col-12 p-md-6">
        <Card title="Reservaciones y Hospedajes">
          <div className="p-4" style={{ height: '300px' }}>
            <Chart type="bar" data={barData} options={barOptions} />
          </div>
        </Card>
      </div>

      <div className="p-col-12 p-md-6">
        <Card title="Reservaciones por Mes">
          <div className="p-4" style={{ height: '300px' }}>
            <Chart type="bar" data={barData} options={barOptions} />
          </div>
        </Card>
      </div>

      <div className="p-col-12">
        <Divider />
      </div>

      <div className="p-col-12 p-md-6">
        <Card title="Hospedajes por Mes">
          <div className="p-4" style={{ height: '300px' }}>
            <Chart type="bar" data={barData} options={barOptions} />
          </div>
        </Card>
      </div>

      <div className="p-col-12 p-md-6">
        <Card title="Monto en Ventas">
          <div className="p-4" style={{ height: '300px' }}>
            <Chart type="bar" data={barData} options={barOptions} />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
