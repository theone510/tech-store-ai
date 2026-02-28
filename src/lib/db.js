import fs from 'fs';
import path from 'path';

const DB_FILE = path.join(process.cwd(), 'src', 'data', 'orders.json');

// Ensure the directory and file exist
if (!fs.existsSync(path.dirname(DB_FILE))) {
    fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
}
if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, '[]', 'utf8');
}

export function getOrders() {
    try {
        const data = fs.readFileSync(DB_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading db:", error);
        return [];
    }
}

export function saveOrder(order) {
    try {
        const orders = getOrders();
        orders.push(order);
        fs.writeFileSync(DB_FILE, JSON.stringify(orders, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error("Error writing to db:", error);
        return false;
    }
}
