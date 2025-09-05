export const fetchExpenses = async (date) => {
  try {
    const selectDate = new Date(date).getTime() || new Date().getTime();
    const res = await fetch(`/api/expense/list/${selectDate}`);
    
    if (!res.ok) {
      // Handle HTTP errors (404, 500, etc.)
      console.error(`HTTP Error: ${res.status} ${res.statusText}`);
      return []; // Return empty array instead of error object
    }
    
    const data = await res.json();
    
    // Ensure we always return an array
    if (Array.isArray(data)) {
      return data;
    } else if (data && data.error) {
      console.error('API Error:', data.error);
      return []; // Return empty array instead of error object
    } else {
      console.error('Unexpected response format:', data);
      return [];
    }
  } catch (error) {
    console.error('Network Error:', error);
    return []; // Return empty array on network errors
  }
};

export const resHandler = async (res, status) => {
  if (res.status === status) {
    return null;
  }
  const data = await res.json();
  if (data && data.emptyFields) {
    return data.emptyFields;
  }
  return null;
};

export const createExpense = async (data) => {
  const res = await fetch(`/api/expense/create`, {
    method: 'POST',
    body: data,
  });
  return resHandler(res, 201);
};

export const updateExpense = async (_id, data) => {
  const res = await fetch(`/api/expense/${_id}`, {
    method: 'PUT',
    body: data,
  });
  return resHandler(res, 200);
};

export const fetchExpense = async (_id) => {
  const res = await fetch(`api/expense/${_id}`);
  return res.json();
};

export const deleteExpense = async (_id) =>
  fetch(`api/expense/${_id}`, {
    method: 'DELETE',
  });

export const formSetter = (data, form) => {
  Object.keys(form).forEach((key) => {
    data.set(key, form[key]);
  });
};

export const expenseByCategory = (expenses) => {
  const categoryBreakdown = expenses.reduce((total, num) => {
    const curTotal = total;
    if (Object.keys(total).includes(num.category)) {
      curTotal[`${num.category}`] =
        Number(total[`${num.category}`]) + Number(num.price);
    } else {
      curTotal[`${num.category}`] = Number(num.price);
    }
    return curTotal;
  }, {});
  const data = Object.keys(categoryBreakdown).map((category) => ({
    x: category,
    y: categoryBreakdown[category],
  }));
  return data;
};
