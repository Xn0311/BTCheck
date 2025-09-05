 
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/FirebaseConfig';

export const fetchSuggestedJobs = async (query: string): Promise<string[]> => {
  const keywords = query.toLowerCase();
  const jobSnapshot = await getDocs(collection(db, 'jobs'));
  const results: string[] = [];

  jobSnapshot.forEach((doc) => {
    const job = doc.data();
    const title = job.title?.toLowerCase();
    const spec = job.specialization?.toLowerCase();
    const loc = job.location?.toLowerCase();

    if (
      keywords.includes(title) ||
      keywords.includes(spec) ||
      keywords.includes(loc)
    ) {
      results.push(job.title);
    }
  });

  return results.slice(0, 5); 
};
