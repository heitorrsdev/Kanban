import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class KanbanService {
  private apiUrl = 'http://localhost:3000'; // URL do backend

  constructor(private http: HttpClient) {}

  getColumns(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/columns`);
  }

  addColumn(title: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/columns`, { title });
  }

  updateColumn(columnId: number, title: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/columns/${columnId}`, { title });
  }

  deleteColumn(columnId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/columns/${columnId}`);
  }

  addCard(columnId: number, title: string, description: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/cards`, { title, description, columnId });
  }
  
  updateCard(cardId: number, title: string, description: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/cards/${cardId}`, { title, description });
  }
  
  deleteCard(cardId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/cards/${cardId}`);
  }

  moveCard(cardId: number, targetColumnId: number): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/cards/${cardId}`, { columnId: targetColumnId });
  }
  
}
