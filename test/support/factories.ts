import { User } from '../../src/app/auth/user.model'
import { Lead } from '../../src/app/crm/lead.model'
import { Stage } from '../../src/app/crm/stage.model'
import { Journey } from '../../src/app/journeys/journey.model'
import * as JourneysAPI from '../../src/app/journeys/journeys.api.model'
import { FieldDefinition } from './../../src/app/crm/field-definition.model'
import { Field } from './../../src/app/crm/field.model'
import { Pipeline } from './../../src/app/crm/pipeline.model'
import { Service } from './../../src/app/settings/service.model'

export function sampleUser(values: { readonly [key: string]: any } = {}): User {
  return new User({
    email: 'john@example.com',
    id: 1,
    name: 'John Boon',
    role: 'lead_owner',
    ...values
  })
}

export function samplePipeline(
  values: { readonly [key: string]: any } = {}
): Pipeline {
  return new Pipeline({
    id: 1,
    name: 'Converted',
    stage_order: [],
    ...values
  })
}

export function sampleStage(
  values: { readonly [key: string]: any } = {}
): Stage {
  return new Stage({
    id: 1,
    name: 'Converted',
    pipeline_id: 1,
    ...values
  })
}

export function sampleLead(values: { readonly [key: string]: any } = {}): Lead {
  const fields = nameFields(values.firstName, values.lastName)

  return new Lead({
    created_by_service_id: null,
    created_by_user_id: null,
    email: 'john@example.com',
    fields: fields,
    id: 1,
    owner: null,
    phone_number: '+999123456',
    stage_id: 1,
    ...values
  })
}

export function sampleField(
  values: { readonly [key: string]: any } = {}
): Field {
  return new Field({
    id: 1,
    name: 'First Name',
    value: 'John',
    ...values
  })
}

export function sampleFieldDefinition(
  values: { readonly [key: string]: any } = {}
): FieldDefinition {
  return new FieldDefinition({
    id: 1,
    name: 'First Name',
    ...values
  })
}

function nameFields(
  firstName: string | null | undefined = 'John',
  lastName: string | null | undefined = 'Boon'
): ReadonlyArray<any> {
  if (firstName && lastName) {
    return [
      {
        id: 1,
        name: 'First Name',
        value: firstName
      },
      {
        id: 2,
        name: 'Last Name',
        value: lastName
      }
    ]
  } else if (firstName && lastName === null) {
    return [
      {
        id: 1,
        name: 'First Name',
        value: firstName
      }
    ]
  } else if (firstName === null && lastName) {
    return [
      {
        id: 2,
        name: 'Last Name',
        value: lastName
      }
    ]
  } else {
    return []
  }
}

export function sampleJourney(
  values: {
    readonly [key in keyof JourneysAPI.IJourney]?: JourneysAPI.IJourney[key]
  } = {}
): Journey {
  return new Journey({
    actions: [
      {
        data: {
          send_from_owner: false,
          template_id: 4
        },
        id: 27,
        journey_id: 4,
        position: 1,
        type: 'send_email'
      }
    ],
    id: 1,
    name: 'motivating introduction 1',
    published_at: null,
    state: 'inactive',
    triggers: [
      {
        data: {
          field_id: 5,
          value: 'value'
        },
        id: 9,
        journey_id: 4,
        type: 'field_updated'
      }
    ],
    ...values
  })
}

export function sampleService(
  values: { readonly [key: string]: any } = {}
): Service {
  return new Service({
    id: 1,
    name: 'Service',
    token: 'Token',
    ...values
  })
}
