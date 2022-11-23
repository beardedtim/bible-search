import { randomUUID } from 'crypto';

const uuid = () => randomUUID({ disableEntropyCache: true });

export default uuid;
