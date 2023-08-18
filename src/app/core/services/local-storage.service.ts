import { Injectable } from '@angular/core';

/**
 * LocalStorage Service
 *
 * This service provides an abstraction over the browser's native localStorage API.
 * It offers methods to persist, retrieve, and delete data from localStorage.
 *
 * @author Jérémy Mulet
 * @date 18/08/23
 */

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

    setItem(key: string, value: any): void {
        localStorage.setItem(key, JSON.stringify(value));
    }

    getItem<T>(key: string): T | null {
        const data = localStorage.getItem(key);
        if (data) {
            return JSON.parse(data);
        }
        return null;
    }

    removeItem(key: string): void {
        localStorage.removeItem(key);
    }

    clear(): void {
        localStorage.clear();
    }
}
