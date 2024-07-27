import React from 'react';
import { XAxis as RechartsXAxis } from 'recharts';

const MyXAxis = ({ dataKey, ...props }) => {
  const defaultDataKey = 'currency'; // Здесь укажите значение по умолчанию для dataKey

  return (
    <RechartsXAxis dataKey={dataKey ?? defaultDataKey} {...props} />
  );
};

export default MyXAxis;
