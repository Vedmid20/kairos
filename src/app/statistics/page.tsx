'use client';

import { useEffect, useState } from 'react';
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveBar } from '@nivo/bar';
import axios from 'axios';
import Cookie from 'js-cookie';
import { useTheme } from 'next-themes';
import '@/app/styles/globals.scss'

const StatisticsPage = () => {
  const [chartData, setChartData] = useState([]);
  const [barData, setBarData] = useState([]);
  const [tickets, setTickets] = useState([]);
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  const projectId = Cookie.get('selectedProject');
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const fetchTasks = async () => {
      if (!token || !projectId) return;

      try {
        const response = await axios.get(`http://127.0.0.1:8008/api/v1/tasks/?projectId=${projectId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const tasks = response.data;
        setTickets(tasks);

        const statusCount = tasks.reduce((acc, task) => {
          const status = task.status_name || 'Unknown';
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {});

        const pieData = Object.entries(statusCount).map(([status, count]) => ({
          id: status,
          label: status,
          value: count,
        }));

        setChartData(pieData);

        const typeCount = tasks.reduce((acc, task) => {
          const type = task.type_name || 'Unknown';
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        }, {});

        const barFormatted = Object.entries(typeCount).map(([type, count]) => ({
          type,
          count,
        }));

        setBarData(barFormatted);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, [projectId, token]);



  return (
      <>
        <h1 className="mb-4">Statistics</h1>
        <title>Statistics</title>

        <div className="flex gap-10">
          <div style={{height: 400, width: 1000}}
               className="h-full w-full dark:text-white rounded-lg shadow border border-violet-500 border-t-8 px-4 py-2 pb-14 mb-6">
            <div className="flex justify-between">
              <h2 className='text-[1.5rem] p-2'>Status overview</h2>
              <h2 className='px-2 my-auto'>Total tickets <span
                  className="bg-violet-500/50 px-3 rounded-full text-black dark:text-white my-auto">{tickets.length}</span>
              </h2>
            </div>
            {chartData.length > 0 ? (
                <ResponsivePie
                    data={chartData}
                    margin={{top: 30, right: 30, bottom: 30, left: 30}}
                    innerRadius={.5}
                    padAngle={1}
                    cornerRadius={1}
                    activeOuterRadiusOffset={10}
                    borderWidth={1}
                    borderColor={{from: 'color', modifiers: [['darker', 0.2]]}}
                    arcLinkLabelsSkipAngle={10}
                    arcLinkLabelsTextColor="#000"
                    arcLinkLabelsThickness={2}
                    arcLinkLabelsColor={{from: 'color'}}
                    arcLabelsSkipAngle={3}
                    arcLabelsTextColor="#fff"
                    theme={{
                      labels: {
                        text: {
                          fontSize: 16,
                          fill: isDark ? '#fff' : '#000',
                        },
                      },
                      legends: {
                        text: {
                          fontSize: 12,
                          fill: isDark ? '#fff' : '#000',
                        },
                      },
                    }}
                />
            ) : (
                <p>Loading...</p>
            )}
          </div>

          <div style={{height: 400 }}
               className="w-full rounded-lg shadow border border-violet-500 border-t-8 px-4 py-2 pb-10 dark:text-white">
            <div className="flex justify-between">
              <h2 className='text-[1.5rem] p-2'>Types overview</h2>
              <h2 className='px-2 my-auto'>Total tickets <span
                  className="bg-violet-500/50 px-3 rounded-full text-black dark:text-white my-auto">{tickets.length}</span>
              </h2>
            </div>
            {barData.length > 0 ? (
                <ResponsiveBar
                    data={barData}
                    keys={['count']}
                    indexBy="type"
                    animate={true}
                    margin={{top: 20, right: 30, bottom: 50, left: 60}}
                    padding={.5}
                    colors={{scheme: 'set2'}}
                    axisBottom={{tickRotation: 0}}
                    axisLeft={{tickSize: 15, tickPadding: 5, tickValues: 3}}
                    labelSkipWidth={22}
                    labelSkipHeight={22}
                    labelTextColor="#fff"
                    theme={{
                      labels: {text: {fontSize: 14}},
                      axis: {
                        ticks: {
                          text: {
                            fontSize: 14,
                            fill: isDark ? '#fff' : '#000',
                          },
                        },
                      },
                    }}
                />
            ) : (
                <p>Loading...</p>
            )}
          </div>
        </div>
      </>
  );
};

export default StatisticsPage;
