import { Component, Input, OnChanges, OnDestroy, Output } from '@angular/core'
import { BehaviorSubject, Observable, Subscription } from 'rxjs'

import { Stage } from './stage.model'

type StageState = 'initial' | 'selected' | 'completed' | 'active' | 'future'

interface IStageViewModel {
  readonly id: number | undefined
  readonly name: string
  readonly state: StageState
}

// Displays list of stages of a pipeline.
//
// The component displays either a selectable list of stages or the progress of the contact through
// the pipeline.
//
// Example usage:
//
//    pipeline([stages]="stages", type="progress", [currentStageId]="contact.stageId")
//
//    pipeline([stages]="stages", type="select", (select)="onSelect($event)")
@Component({
  selector: 'pipeline',
  templateUrl: 'pipeline.component.html'
})
export class PipelineComponent implements OnChanges, OnDestroy {
  @Input() public currentStageId: number | undefined
  @Input() public readonly stages?: ReadonlyArray<Stage>
  @Input() public readonly type: 'select' | 'progress'

  @Output()
  public readonly select: BehaviorSubject<
    number | undefined
  > = new BehaviorSubject<number | undefined>(undefined)

  public readonly stageData: BehaviorSubject<
    ReadonlyArray<IStageViewModel>
  > = new BehaviorSubject<ReadonlyArray<IStageViewModel>>([])

  private readonly selectSubscription: Subscription

  constructor() {
    this.selectSubscription = this.select.subscribe((stage) =>
      this.ngOnChanges()
    )
  }

  ngOnChanges(): void {
    const stages = this.stages || []
    const stageData =
      this.type === 'select'
        ? this.getStagesSelect(stages, this.select.getValue())
        : this.getStagesProgress(stages, this.currentStageId)
    this.stageData.next(stageData)
  }

  ngOnDestroy(): void {
    this.selectSubscription.unsubscribe()
  }

  public onClick(stage: Stage): void {
    if (this.type === 'select') {
      this.select.next(stage.id)
    } else {
      this.currentStageId = stage.id
      this.select.next(stage.id)
    }
  }

  public onViewAllClick(): void {
    if (this.type === 'select') {
      this.select.next(undefined)
    }
  }

  get viewAllContainerClass(): Observable<string> {
    return this.select.map((stageId) => {
      if (stageId === undefined || this.isOutOfScopeSelection(stageId)) {
        return 'view-all-container-selected'
      } else {
        return 'view-all-container-initial'
      }
    })
  }

  private isOutOfScopeSelection(stageId: number): boolean {
    const stages = this.stages || []
    return stages.find((stage) => stage.id === stageId) === undefined
  }

  private getStagesSelect(
    stages: ReadonlyArray<Stage>,
    selectedStageId: number | undefined
  ): ReadonlyArray<IStageViewModel> {
    return stages.map((stage) => {
      return {
        id: stage.id,
        name: stage.name,
        state: (stage.id === selectedStageId
          ? 'selected'
          : 'initial') as StageState
      }
    })
  }

  private getStagesProgress(
    stages: ReadonlyArray<Stage>,
    currentStageId: number | undefined
  ): ReadonlyArray<IStageViewModel> {
    const result = stages.reduce<[ReadonlyArray<IStageViewModel>, StageState]>(
      (acc, stage) => {
        const stageVM: IStageViewModel = {
          id: stage.id,
          name: stage.name,
          state: (stage.id === currentStageId ? 'active' : acc[1]) as StageState
        }
        return [
          [...acc[0], stageVM],
          (stage.id === currentStageId ? 'future' : acc[1]) as StageState
        ]
      },
      [[], 'completed']
    )
    return result[0]
  }
}
