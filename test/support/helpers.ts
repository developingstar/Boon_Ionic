import { ErrorHandler, Type } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { IonicModule } from 'ionic-angular'

class CustomErrorHandler {
  handleError(error: any): void {
    throw error
  }
}

export function initComponent<T>(
  klass: Type<T>,
  opts: {
    readonly declarations?: any[]
    readonly imports?: any[]
    readonly providers?: any[]
  }
): ComponentFixture<T> {
  TestBed.configureTestingModule({
    declarations: opts.declarations || [],
    imports: [IonicModule.forRoot(klass)].concat(opts.imports || []),
    providers: [{ provide: ErrorHandler, useClass: CustomErrorHandler }].concat(
      opts.providers || []
    )
  }).compileComponents()
  return TestBed.createComponent(klass)
}
