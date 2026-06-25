export type BlockTypes = 'BLOCK' | 'EMBEDS'
export type MatchTypes = 'TEXT' | 'WILDCARD' | 'REGEX'

export interface BlockRule {
  blockType: BlockTypes
  ID: number
}

export interface BlockUrlRule extends BlockRule {
  matchPattern: string
  matchPatternType: MatchTypes
  saved: Boolean
}
