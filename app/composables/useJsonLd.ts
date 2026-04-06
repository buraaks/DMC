import { computed, toValue } from 'vue'

export function useJsonLd(input: object | object[] | (() => object | object[])) {
  const schema = computed(() => toValue(input))

  useHead({
    script: computed(() => [{
      key: 'structured-data',
      type: 'application/ld+json',
      children: JSON.stringify(schema.value),
    }]),
  })
}
