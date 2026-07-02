<script>
import $ from 'jquery'
import RegexColorizer from 'regex-colorizer'
import misc from '../misc.js'

function getOffset(children, oldTextIndex) {
  let textIndex = 0
  let offset = null

  for (let i = 0; i < children.length; i++) {
    const childNode = children[i]
    const length = childNode.textContent.length
    textIndex += length
    if (textIndex > oldTextIndex) {
      const offsetIndex = length - (textIndex - oldTextIndex)
      offset = [childNode, offsetIndex]
      break
    }
  }

  if (offset === null) {
    const lastChild = children[children.length - 1]
    if (lastChild === undefined)
      misc.log('LASTCHILD-UNDEFINED', children)

    offset = [lastChild, lastChild.textContent.length]
  }

  const node = offset[0]
  const offsetIndex = offset[1]
  const childNodes = node.childNodes
  if ((childNodes !== undefined) && childNodes.length > 0)
    offset = getOffset(childNodes, offsetIndex)

  return offset
}

function getTextIndex(
  match, element, offsetIndex,
) {
  if (match === element)
    return offsetIndex

  const children = element.childNodes
  let currentTextIndex = 0

  for (let i = 0; i < children.length; i++) {
    const childNode = children[i]

    if (match === childNode) {
      const textIndex = currentTextIndex
      return textIndex + offsetIndex
    }

    const childNodes = childNode.childNodes
    if ((childNodes !== undefined) && childNodes.length > 0) {
      const childTextIndex = getTextIndex(match, childNode, 0)
      if (childTextIndex !== null) {
        const textIndex = currentTextIndex + childTextIndex
        return textIndex + offsetIndex
      }
    }

    currentTextIndex += childNode.textContent.length
  }

  return null
}

function isDescendant(parent, child) {
  let node = child.parentNode
  while (node !== null) {
    if (node === parent)
      return true

    node = node.parentNode
  }
  return false
}

function setSelection(element, startIndex, endIndex) {
  const newRange = document.createRange()
  newRange.selectNodeContents(element)
  const children = element.childNodes
  const startOffset = getOffset(children, startIndex)
  const endOffset = getOffset(children, endIndex)

  newRange.setStart(startOffset[0], startOffset[1])
  newRange.setEnd(endOffset[0], endOffset[1])
  const selection = window.getSelection()
  selection.removeAllRanges()
  selection.addRange(newRange)
}

function getTextIndexes(element) {
  const selection = window.getSelection()
  if (selection.rangeCount === 0)
    return null

  const range = selection.getRangeAt(0)
  const startHolder = range.startContainer
  const endHolder = range.endContainer
  const start = range.startOffset
  const end = range.endOffset
  const startTextIndex = getTextIndex(startHolder, element, start)
  const endTextIndex = getTextIndex(endHolder, element, end)
  return [startTextIndex, endTextIndex]
}

export default {

  props: {
    colorizer: { default: null },
    value: { default: '' },
    editable: { default: true },
  },
  data: () => ({
    isEnabled: true,
    message: 'hello',
    lastText: '',
    HTML: '',
  }),

  computed: { },

  asyncComputed: { },

  watch: {
    value(newVal, oldVal) {
      this.refreshHighlights(newVal)
    },
    colorizer(newColorizer, oldColorizer) {
      this.refreshHighlights(this.lastText)
      this.flush(false)
    },
  },

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  created() {},

  mounted() {
    const element = this.$refs.EditInline
    const $element = $(element)
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this
    // \\*\*

    $element.on('keyup paste input', () => {
      const text = $element.text()
      if (text === self.lastText)
        return

      this.$emit('input', text)
      self.lastText = text
      self.refreshHighlights(text)
    })

    $element.on('click', (event) => {
      if (event.detail === 2) {
        const selection = window.getSelection()
        misc.log('SELECTION', event, selection)
        if (!isDescendant(element, selection.anchorNode)) {
          misc.log('NOT DESCENDENt')
          return
        }

        const text = $element.text()
        setSelection(element, 0, text.length)
        event.preventDefault()
      }

      misc.log('CLICK', [event.detail, event])
    })

    $(element).on('keydown', (event) => {
      const selection = window.getSelection()
      // misc.log('SELECTION', selection)
      if (!isDescendant(element, selection.anchorNode))
        return

      else if (element !== event.currentTarget)
        return

      const text = $element.text()
      const indexes = getTextIndexes(element)

      if (event.key === 'End') {
        setSelection(element, text.length, text.length)
      }
      else if (event.key === 'Home') {
        setSelection(element, 0, 0)
      }
      else if (indexes !== null) {
        const [startTextIndex, endTextIndex] = indexes
        let index = 0

        if (event.key === 'ArrowLeft') {
          misc.log('PRESSLEFT', startTextIndex, endTextIndex)
          index = Math.max(0, startTextIndex - 1)
          setSelection(element, index, index)
          event.preventDefault()
        }
        else if (event.key === 'ArrowRight') {
          misc.log('PRESSRIGHT', startTextIndex, endTextIndex)
          index = Math.min(text.length, endTextIndex + 1)
          setSelection(element, index, index)
          event.preventDefault()
        }
        else if (event.key === 'Backspace') {
          index = startTextIndex
          const newText = (
            text.slice(0, index - 1)
              + text.slice(index, text.length)
          )

          misc.log('BACCCK', text, index, newText)
          this.refreshHighlights(newText)
          index = Math.max(0, index - 1)
          setSelection(element, index, index)
          event.preventDefault()
          this.$emit('input', newText)
        }
      }
    })
  },

  methods: {
    flush(start = false) {
      const element = this.$refs.EditInline
      const indexes = getTextIndexes(element)
      const textLength = $(element).text()

      if (indexes === null) {
        return false
      }
      else {
        setSelection(element, textLength, textLength)
        return true
      }
    },

    colorizeText(input) {
      if (this.colorizer === null)
        return RegexColorizer.colorizeText(input)

      // $.parseHTML('fsdfsdf<b>.</b><b>+</b>')
      // misc.log('InPUTCOLORIZER', this)
      return this.colorizer(input)
    },

    refreshHighlights(text) {
      if (text === undefined)
        text = this.lastText

      if (text !== self.lastText)
        this.lastText = text

      const element = this.$refs.EditInline
      const $element = $(element)
      const indexes = getTextIndexes(element)

      const highlightHTML = this.colorizeText(text)
      if (highlightHTML === false)
        $element.text(text)

      else
        $element.html(highlightHTML)

      if (indexes === null) {
        return false
      }
      else {
        const [startTextIndex, endTextIndex] = indexes
        setSelection(element, startTextIndex, endTextIndex)
        return true
      }
    },
  },
}
</script>

<template lang="pug">
div(class="regex-wrapper")
  div(
    spellcheck="false"
    class="regex"
    ref="EditInline"
    :contenteditable="editable"
  )
</template>

<style style>
.regex {
  font-family: 'Ubuntu Mono';
  overflow-x: scroll;
  overflow-y: hidden;
  white-space: nowrap;
  padding-bottom: 0.5rem;
  padding-top: 0.5rem;
  display: flex;
  text-align: start;
  height: 1rem;
} .regex * {
  font-family: 'Ubuntu Mono';
  height: 1rem;
}

div.regex {
  border-bottom: 1px solid #dcdfe6;
}

div.regex::-webkit-scrollbar {
  width: 0px;
  height: 0px;
}

.regex b     {background: #aad1f7;}
/* metasequence */
.regex i     {background: #e3e3e3;}
/* char class */
.regex i b   {background: #9fb6dc;}
/* char class: metasequence */
.regex i u   {background: #c3c3c3;}
/* char class: range-hyphen */
.regex b.g1  {background: #b4fa50; color: #000;}
/* group: depth 1 */
.regex b.g2  {background: #8cd400; color: #000;}
/* group: depth 2 */
.regex b.g3  {background: #26b809; color: #fff;}
/* group: depth 3 */
.regex b.g4  {background: #30ea60; color: #000;}
/* group: depth 4 */
.regex b.g5  {background: #0c8d15; color: #fff;}
/* group: depth 5 */
.regex b.err {background: #e30000; color: #fff;}
/* error */
.regex b, .regex i, .regex u {
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  display: flex;
}

.regex[contenteditable]:focus {
  outline: 0px solid transparent;
  display: flex;
  height: 1rem;
}
</style>
