import { Stage } from '../../src/app/crm/stage.model'
import * as JourneysAPI from '../../src/app/journeys/journeys.api.model'
import { Group } from '../../src/app/settings/group.model'
import { FieldDefinition } from './../../src/app/crm/field-definition.model'
import { Field } from './../../src/app/crm/field.model'
import {
  IEmailTemplate,
  ITextTemplate
} from './../../src/app/messages/messages.api.model'
import { Shortcode } from './../../src/app/messages/shortcode.model'
import { Service } from './../../src/app/settings/service.model'

export function sampleUser(
  values: { readonly [key: string]: any } = {}
): Auth.API.IUser {
  return {
    avatar_url: null,
    email: 'john@example.com',
    id: 100,
    name: 'John Boon',
    password: 'secret',
    phone_number: '',
    role: 'admin',
    ...values
  }
}

export function samplePipeline(
  values: { readonly [key: string]: any } = {}
): Crm.API.IPipeline {
  return {
    id: 1,
    name: 'Converted',
    stage_order: [],
    ...values
  }
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

export function sampleContact(
  values: { readonly [key: string]: any } = {}
): Crm.API.IContact {
  const fields = nameFields(values.firstName, values.lastName)

  return {
    created_by_service_id: null,
    created_by_user_id: null,
    email: 'john@example.com',
    fields: fields,
    first_name: 'First Name',
    id: 1,
    inserted_at: '2017-12-01T07:00:00.000Z',
    last_name: 'Last Name',
    owner: null,
    phone_number: '+999123456',
    stage_id: 1,
    updated_at: '2017-12-01T07:00:00.000Z',
    ...values
  }
}
export function sampleDeal(
  values: { readonly [key: string]: any } = {}
): Deal.API.IDeals {
  return {
    contact: null,
    created_by_service_id: 1,
    created_by_user_id: 1,
    email: 'john@example.com',
    id: 1,
    name: 'Sample Deal',
    owner: null,
    pipeline: 'New',
    stage_id: 1,
    value: 10000,
    ...values
  }
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

export function sampleTextTemplate(
  values: { readonly [key: string]: any } = {}
): ITextTemplate {
  return {
    content: 'Hello',
    default_sender: '+999600100200',
    id: 1,
    name: 'Introduction text message',
    ...values
  }
}

export function sampleEmailTemplate(
  values: { readonly [key: string]: any } = {}
): IEmailTemplate {
  return {
    content: 'Hello',
    default_sender: 'user@example.com',
    default_sender_name: 'Support',
    id: 1,
    name: 'Introduction e-mail message',
    subject: 'Introduction',
    ...values
  }
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
): JourneysAPI.IJourney {
  return {
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
  }
}

export function sampleService(
  values: { readonly [key: string]: any } = {}
): Service {
  return new Service({
    id: 1,
    name: 'Twilio',
    token: 'secret:token',
    ...values
  })
}

export function sampleShortcode(
  values: { readonly [key: string]: any } = {}
): Shortcode {
  return new Shortcode({
    name: 'First Name',
    shortcode: 'first_name',
    ...values
  })
}

export function sampleGroup(
  values: { readonly [key: string]: any } = {}
): Group {
  return new Group({
    id: 1,
    name: 'Group Name',
    ...values
  })
}
