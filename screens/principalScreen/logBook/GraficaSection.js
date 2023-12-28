import React, { useState, useEffect} from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Svg, { Circle, Line, Text as SvgText } from 'react-native-svg';

const GraficaSection = () => {

  const eventos = [
    { hora: 2.5, tipo: 'Inicio de viaje', estado: 'OFF' },
    { hora: 4.3, tipo: 'Descanso', estado: 'SB' },
    { hora: 5.3, tipo: 'Descanso', estado: 'OFF' },
    { hora: 6.3, tipo: 'Descanso', estado: 'ON' },
    { hora: 7.3, tipo: 'Descanso', estado: 'D' },
    { hora: 10.3, tipo: 'Descanso', estado: 'D' },
    { hora: 14.3, tipo: 'Descanso', estado: 'SB' },
    { hora: 19.3, tipo: 'Descanso', estado: 'SB' },
    { hora: 22.3, tipo: 'Descanso', estado: 'OFF' },
    { hora: 24.0, tipo: 'Descanso', estado: 'OFF' },
  ];
  

  const estados = ['OFF', 'OFF', 'SB', 'SB', 'SB', 'D', 'D', 'ON', 'ON', 'ON', 'D', 'D', 'OFF'];

  const width = 300;
  const height = 220;
  const marginLeft = 40;
  const marginRight = 20;
  const marginTop = 20;
  const marginBottom = 40;

  const chartWidth = width - marginLeft - marginRight;
  const chartHeight = height - marginTop - marginBottom;
  const intervaloX = chartWidth / 24;

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.graphTitle}>Estado del Camión a lo largo del día</Text>
      <Svg width={width} height={height}>
        {/* Eje Y */}
        <SvgText x={10} y={marginTop + 10} fontSize="12" fontWeight="bold">OFF</SvgText>
        <SvgText x={10} y={marginTop + chartHeight / 3 + 10} fontSize="12" fontWeight="bold">SB</SvgText>
        <SvgText x={10} y={marginTop + (chartHeight * 2) / 3 + 10} fontSize="12" fontWeight="bold">D</SvgText>
        <SvgText x={10} y={marginTop + chartHeight - 10} fontSize="12" fontWeight="bold">ON</SvgText>

        {/* Eje X */}
        {Array.from({ length: 25 }).map((_, i) => (
          <React.Fragment key={i}>
            <Line
              x1={marginLeft + i * intervaloX}
              y1={marginTop}
              x2={marginLeft + i * intervaloX}
              y2={marginTop + chartHeight}
              stroke="#ccc"
              strokeWidth="0.5"
            />
            <SvgText x={marginLeft + i * intervaloX} y={height - marginBottom} fontSize="10" textAnchor="middle">
              {i}
            </SvgText>
          </React.Fragment>
        ))}

        {/* Puntos del gráfico */}
        {eventos.map((evento, index) => (
          <React.Fragment key={index}>
            <Circle
              cx={marginLeft + (evento.hora / 24) * chartWidth}
              cy={
                evento.estado === 'OFF' ? marginTop :
                evento.estado === 'SB' ? chartHeight / 3 + marginTop :
                evento.estado === 'D' ? (chartHeight * 2) / 3 + marginTop :
                chartHeight + marginTop
              }
              r="3"
              fill={evento.estado === 'ON' ? '#4CAF50' : '#333'}
            />
            {index > 0 && (
              <Line
                x1={marginLeft + (eventos[index - 1].hora / 24) * chartWidth}
                y1={
                  eventos[index - 1].estado === 'OFF' ? marginTop :
                  eventos[index - 1].estado === 'SB' ? chartHeight / 3 + marginTop :
                  eventos[index - 1].estado === 'D' ? (chartHeight * 2) / 3 + marginTop :
                  chartHeight + marginTop
                }
                x2={marginLeft + (evento.hora / 24) * chartWidth}
                y2={
                  evento.estado === 'OFF' ? marginTop :
                  evento.estado === 'SB' ? chartHeight / 3 + marginTop :
                  evento.estado === 'D' ? (chartHeight * 2) / 3 + marginTop :
                  chartHeight + marginTop
                }
                stroke="#4CAF50"
                strokeWidth="1"
              />
            )}
          </React.Fragment>
        ))}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    flex: 1,
    marginBottom: 20,
    alignItems: 'center',
  },
  graphTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
});

export default GraficaSection;
