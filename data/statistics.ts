// utils/statistics.ts
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/FirebaseConfig';
import { startOfDay, startOfWeek, startOfMonth, parseISO } from 'date-fns';

export async function fetchCartStatistics() {
  const snapshot = await getDocs(collection(db, 'validatedCarts'));
  const items = snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      total: data.total || 0,
      createdAt: data.createdAt?.toDate(),
    };
  });

  const daily = {};
  const weekly = {};
  const monthly = {};

  items.forEach(({ total, createdAt }) => {
    if (!createdAt) return;
    const day = startOfDay(createdAt).toISOString().split('T')[0];
    const week = startOfWeek(createdAt, { weekStartsOn: 1 }).toISOString().split('T')[0];
    const month = startOfMonth(createdAt).toISOString().split('T')[0];

    const accumulate = (obj, key) => {
      obj[key] = obj[key] || { count: 0, total: 0 };
      obj[key].count += 1;
      obj[key].total += total;
    };

    accumulate(daily, day);
    accumulate(weekly, week);
    accumulate(monthly, month);
  });

  return { daily, weekly, monthly };
}
