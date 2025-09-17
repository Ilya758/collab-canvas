import { Observable } from 'rxjs';
import { Metadata } from '@grpc/grpc-js';
import { CreateProjectDto } from 'src/modules/projects/dto/create-project.dto';
import { UpdateProjectDto } from 'src/modules/projects/dto/update-project.dto';
import { CreateBoardDto } from 'src/modules/boards/dto/create-board.dto';
import { UpdateBoardDto } from 'src/modules/boards/dto/update-board.dto';
import { Board } from './board';
import { Project } from './project';
import { ElementDto } from 'src/modules/elements/dto/element-dto';

export interface WorkspaceService {
  createProject(
    data: CreateProjectDto,
    metadata: Metadata,
  ): Observable<{ id: number }>;
  findProjectsByUserId(
    data: { userId: number },
    metadata?: Metadata,
  ): Observable<Project[]>;
  findProjectById(
    data: { id: number },
    metadata?: Metadata,
  ): Observable<Project>;
  updateProject(data: UpdateProjectDto, metadata?: Metadata): Observable<void>;
  deleteProject(data: { id: number }, metadata?: Metadata): Observable<void>;
}

export interface BoardService {
  createBoard(
    data: CreateBoardDto,
    metadata?: Metadata,
  ): Observable<{ id: number }>;
  findBoardsByProjectId(
    data: { projectId: number },
    metadata?: Metadata,
  ): Observable<Board[]>;
  findBoardById(
    data: { id: number; projectId: number },
    metadata?: Metadata,
  ): Observable<Board>;
  updateBoard(data: UpdateBoardDto, metadata?: Metadata): Observable<void>;
  deleteBoard(
    data: { id: number; projectId: number },
    metadata?: Metadata,
  ): Observable<void>;
}

export interface ElementService {
  createElement(
    data: ElementDto,
    metadata?: Metadata,
  ): Observable<{ id: string }>;
  findElementsByBoardId(
    data: { boardId: number },
    metadata?: Metadata,
  ): Observable<Element[]>;
  findElementById(
    data: { id: string; boardId: number },
    metadata?: Metadata,
  ): Observable<Element>;
  updateElement(
    data: ElementDto & { id: string },
    metadata?: Metadata,
  ): Observable<void>;
  deleteElement(
    data: { id: string; boardId: number },
    metadata?: Metadata,
  ): Observable<void>;
}
