import { Component, OnInit } from '@angular/core';
import { KanbanService } from '../../services/kanban.service';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

interface Column {
  id: number;
  title: string;
  cards: Card[];
  isEditing?: boolean;
  previousTitle?: string;
  isAddingCard?: boolean;
  confirmDeleteColumn?: boolean;
}

interface Card {
  id: number;
  title: string;
  description: string;
  isEditing?: boolean;
  previousTitle?: string;
  previousDescription?: string;
}

@Component({
  selector: 'app-kanban-board',
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.css'],
})
export class KanbanBoardComponent implements OnInit {
  columns: Column[] = [];
  selectedCard: any = null; // Card selecionado para exibir no modal
  
  constructor(private kanbanService: KanbanService) {}

  ngOnInit(): void {
    this.loadColumns();
  }

  loadColumns() {
    this.kanbanService.getColumns().subscribe((data) => {
      this.columns = data;
    });
  }

  addColumn(title: string) {
    if (!title.trim()) return;
    this.kanbanService.addColumn(title).subscribe(() => {
      this.loadColumns();
    });
  }

  deleteColumnConfirmation(column: Column) {
    column.confirmDeleteColumn = !column.confirmDeleteColumn;
  }

  deleteColumn(column: Column) {
    this.kanbanService.deleteColumn(column.id).subscribe(() => {
      this.loadColumns();
    });
    this.deleteColumnConfirmation(column);
  }

  addCardForm(column: Column): void {
    column.isAddingCard = !column.isAddingCard;
  }

  addCard(column: Column, title: string, description: string) {
    if (!title.trim() || !description.trim()) {
      alert('Title and description cannot be empty.');
      return;
    }
  
    const columnId = column.id;
    // Encontra a coluna no front-end para atualização local
    const targetColumn = this.columns.find(column => column.id === columnId);
  
    if (!targetColumn) {
      console.error(`Column with ID ${columnId} not found.`);
      return;
    }
  
    this.kanbanService.addCard(columnId, title, description).subscribe((newCard) => {
      // Atualiza localmente a coluna sem recarregar tudo
      targetColumn.cards.push(newCard);
  
      // Fecha o modal de adição
      column.isAddingCard = false;
    }, (error) => {
      console.error('Error adding card:', error);
      alert('Failed to add card. Please try again.');
    });
  }
  

  deleteCard(cardId: number) {
    this.kanbanService.deleteCard(cardId).subscribe(() => {
      this.loadColumns();
    });
  }

  updateCard(cardId: number, newTitle: string | null, newDescription: string | null) {
    if (!newTitle || !newDescription) return;
    this.kanbanService.updateCard(cardId, newTitle, newDescription).subscribe(() => {
      this.loadColumns();
    });
  }

  openModal(card: any): void {
    this.selectedCard = card;
  }

  closeModal(): void {
    if (this.selectedCard.isEditing) {
      // Cancela a edição do card
      this.cancelCardEdit(this.selectedCard);
    }
    this.selectedCard = null;
  }
  
  // Atualiza o backend para refletir a nova coluna do card
  moveCard(cardId: number, targetColumnId: number): void {
    this.kanbanService.moveCard(cardId, targetColumnId).subscribe(() => {
      this.loadColumns();
    });
  }

  // Move o card para outra coluna
  drop(event: CdkDragDrop<Card[]>, targetColumn: Column) {
    const card = event.previousContainer.data[event.previousIndex];
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );

    this.moveCard(card.id, targetColumn.id);
  }

  enableColumnEdit(column: Column): void {
    column.previousTitle = column.title;
    column.isEditing = true;
  }

  cancelColumnEdit(column: Column): void {
    column.title = column.previousTitle || '';
    column.isEditing = false;
  }

  saveColumnChanges(column: Column): void {
    if (column.title.trim() && column.title !== column.previousTitle) {
      this.kanbanService.updateColumn(column.id, column.title).subscribe(() => {
        this.loadColumns();
      });
      column.isEditing = false;
    } else {
      alert('Column title cannot be empty.');
    }
  }

  enableCardEdit(card: Card): void {
  // Salva os valores antigos para restaurar caso o usuário cancele
  card.isEditing = true;
  card.previousTitle = card.title;
  card.previousDescription = card.description;
  }

  saveCardChanges(card: Card): void {
    if (card.title.trim() && card.description.trim()) {
      this.updateCard(card.id, card.title, card.description); // Atualiza no backend
      card.isEditing = false;
    } else {
      alert('Title and description cannot be empty.');
    }
  }

  cancelCardEdit(card: Card): void {
    // Restaura os valores antigos
    card.title = card.previousTitle || '';
    card.description = card.previousDescription || '';
    card.isEditing = false;
  }
}
