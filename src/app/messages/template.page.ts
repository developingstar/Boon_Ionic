import { NavController, NavParams, ToastController } from 'ionic-angular'
import { BehaviorSubject, Observable } from 'rxjs'

import { ReactivePage } from '../utils/reactive-page'
import { showToast } from '../utils/toast'
import { MessagesService } from './messages.service'
import { State, UserAction } from './template.page.state'

export abstract class TemplatePage<
  Model,
  IModel,
  TemplateFormGroup
> extends ReactivePage<State<Model, IModel, TemplateFormGroup>, UserAction> {
  public readonly initialMode: 'new' | 'edit'

  protected readonly templateID: number
  protected readonly saveFailed: BehaviorSubject<boolean> = new BehaviorSubject(
    false
  )

  protected abstract readonly resourcesRootPage: string

  constructor(
    initialState: State<Model, IModel, TemplateFormGroup>,
    navParams: NavParams,
    protected navController: NavController,
    protected messagesService: MessagesService,
    protected toastController: ToastController
  ) {
    super(initialState)

    const rawParam = navParams.get('id')

    if (rawParam === 'new') {
      this.initialMode = 'new'
    } else {
      this.initialMode = 'edit'
      this.templateID = Number(navParams.get('id'))
    }
  }

  public itemSelected(value: string): void {
    this.uiActions.next({ name: 'shortcode', value: `{{ ${value} }}` })
  }

  public save(): void {
    if (this.initialMode === 'new') {
      this.uiActions.next({ name: 'create' })
    } else {
      this.uiActions.next({ name: 'update' })
    }
  }

  get formGroup(): Observable<TemplateFormGroup | undefined> {
    return this.state.flatMap((state) => {
      if (state.mode === 'init') {
        return Observable.empty()
      } else {
        return Observable.of(state.form)
      }
    })
  }

  get shortcodeNames(): Observable<ReadonlyArray<string>> {
    return this.state.flatMap((state) => {
      if (state.mode === 'init') {
        return Observable.empty()
      } else {
        const labels = state.shortcodes.map(
          (shortcode) => `${shortcode.shortcode}`
        )
        return Observable.of(labels)
      }
    })
  }

  protected initialAction(): UserAction {
    if (this.initialMode === 'new') {
      return { name: 'new' }
    } else {
      return { name: 'edit' }
    }
  }

  protected reduce(
    state: State<Model, IModel, TemplateFormGroup>,
    action: UserAction
  ): Observable<State<Model, IModel, TemplateFormGroup>> {
    switch (action.name) {
      case 'new':
        return this.new(state)
      case 'create':
        return this.create(state)
          .do(this.redirectOnSuccess.bind(this))
          .do(this.toastOnSuccess.bind(this))
      case 'edit':
        return this.edit(state)
      case 'update':
        return this.update(state)
          .do(this.redirectOnSuccess.bind(this))
          .do(this.toastOnSuccess.bind(this))
      case 'shortcode':
        return this.addShortCode(state, action.value)
    }
  }

  protected abstract createFormGroup(
    values: Model | IModel | undefined
  ): TemplateFormGroup
  protected abstract new(
    state: State<Model, IModel, TemplateFormGroup>
  ): Observable<State<Model, IModel, TemplateFormGroup>>
  protected abstract createTemplate(form: TemplateFormGroup): Observable<Model>
  protected abstract edit(
    state: State<Model, IModel, TemplateFormGroup>
  ): Observable<State<Model, IModel, TemplateFormGroup>>
  protected abstract updateTemplate(
    id: number,
    form: TemplateFormGroup
  ): Observable<Model>
  protected abstract getTemplateId(template: Model): number

  protected abstract addShortCode(
    state: State<Model, IModel, TemplateFormGroup>,
    shortcode: string
  ): Observable<State<Model, IModel, TemplateFormGroup>>

  private create(
    state: State<Model, IModel, TemplateFormGroup>
  ): Observable<State<Model, IModel, TemplateFormGroup>> {
    if (state.mode === 'new') {
      this.saveFailed.next(false)

      return this.createTemplate(state.form)
        .catch((error) => {
          this.saveFailed.next(true)
          return this.handleRequestError<IModel>(error, state.template)
        })
        .map((template) => ({
          ...state,
          template: template as IModel
        }))
    } else {
      return Observable.of(state)
    }
  }

  private update(
    state: State<Model, IModel, TemplateFormGroup>
  ): Observable<State<Model, IModel, TemplateFormGroup>> {
    if (state.mode === 'edit' && state.template !== undefined) {
      this.saveFailed.next(false)

      return this.updateTemplate(this.getTemplateId(state.template), state.form)
        .catch((error) => {
          this.saveFailed.next(true)
          return this.handleRequestError<Model>(error, state.template!)
        })
        .map((template) => ({
          ...state,
          template: template
        }))
    } else {
      return Observable.of(state)
    }
  }

  private redirectOnSuccess(
    state: State<Model, IModel, TemplateFormGroup>
  ): void {
    if (
      state.mode !== 'init' &&
      state.template !== undefined &&
      !this.saveFailed.getValue()
    ) {
      this.navController.setRoot(this.resourcesRootPage)
    }
  }

  private toastOnSuccess(): void {
    if (!this.saveFailed.getValue()) {
      showToast(this.toastController, 'Template has been successfully saved.')
    }
  }

  private handleRequestError<T>(error: any, defaultValue: T): Observable<T> {
    if (error.status === 422) {
      showToast(
        this.toastController,
        'Failed to save the template. Make sure that the name is unique.',
        2000,
        false
      )
    }

    return Observable.of(defaultValue)
  }
}
