'use client'

export interface WCAGCheckResult {
  id: string
  guideline: string
  level: 'A' | 'AA' | 'AAA'
  status: 'pass' | 'fail' | 'warning' | 'manual'
  description: string
  impact: 'low' | 'medium' | 'high' | 'critical'
  elements?: Element[]
  details?: string
  recommendation?: string
}

export interface AccessibilityAuditResult {
  score: number
  totalChecks: number
  passed: number
  failed: number
  warnings: number
  manual: number
  results: WCAGCheckResult[]
  summary: {
    perceivable: WCAGCheckResult[]
    operable: WCAGCheckResult[]
    understandable: WCAGCheckResult[]
    robust: WCAGCheckResult[]
  }
}

export class WCAGAuditor {
  private document: Document
  
  constructor(doc: Document = document) {
    this.document = doc
  }

  async performAudit(): Promise<AccessibilityAuditResult> {
    const results: WCAGCheckResult[] = []
    
    // Perceivable checks
    results.push(...await this.checkPerceivable())
    
    // Operable checks
    results.push(...await this.checkOperable())
    
    // Understandable checks
    results.push(...await this.checkUnderstandable())
    
    // Robust checks
    results.push(...await this.checkRobust())
    
    return this.compileResults(results)
  }

  private async checkPerceivable(): Promise<WCAGCheckResult[]> {
    const results: WCAGCheckResult[] = []

    // 1.1.1 Non-text Content (Level A)
    results.push(this.checkNonTextContent())
    
    // 1.2.1 Audio-only and Video-only (Prerecorded) (Level A)
    results.push(this.checkMediaAlternatives())
    
    // 1.3.1 Info and Relationships (Level A)
    results.push(this.checkInfoAndRelationships())
    
    // 1.3.2 Meaningful Sequence (Level A)
    results.push(this.checkMeaningfulSequence())
    
    // 1.3.3 Sensory Characteristics (Level A)
    results.push(this.checkSensoryCharacteristics())
    
    // 1.4.1 Use of Color (Level A)
    results.push(this.checkUseOfColor())
    
    // 1.4.2 Audio Control (Level A)
    results.push(this.checkAudioControl())
    
    // 1.4.3 Contrast (Minimum) (Level AA)
    results.push(await this.checkContrastMinimum())
    
    // 1.4.4 Resize text (Level AA)
    results.push(this.checkResizeText())
    
    // 1.4.5 Images of Text (Level AA)
    results.push(this.checkImagesOfText())

    return results
  }

  private async checkOperable(): Promise<WCAGCheckResult[]> {
    const results: WCAGCheckResult[] = []

    // 2.1.1 Keyboard (Level A)
    results.push(this.checkKeyboardAccessible())
    
    // 2.1.2 No Keyboard Trap (Level A)
    results.push(this.checkNoKeyboardTrap())
    
    // 2.1.4 Character Key Shortcuts (Level A)
    results.push(this.checkCharacterKeyShortcuts())
    
    // 2.2.1 Timing Adjustable (Level A)
    results.push(this.checkTimingAdjustable())
    
    // 2.2.2 Pause, Stop, Hide (Level A)
    results.push(this.checkPauseStopHide())
    
    // 2.3.1 Three Flashes or Below Threshold (Level A)
    results.push(this.checkThreeFlashes())
    
    // 2.4.1 Bypass Blocks (Level A)
    results.push(this.checkBypassBlocks())
    
    // 2.4.2 Page Titled (Level A)
    results.push(this.checkPageTitled())
    
    // 2.4.3 Focus Order (Level A)
    results.push(this.checkFocusOrder())
    
    // 2.4.4 Link Purpose (In Context) (Level A)
    results.push(this.checkLinkPurpose())
    
    // 2.4.5 Multiple Ways (Level AA)
    results.push(this.checkMultipleWays())
    
    // 2.4.6 Headings and Labels (Level AA)
    results.push(this.checkHeadingsAndLabels())
    
    // 2.4.7 Focus Visible (Level AA)
    results.push(this.checkFocusVisible())

    return results
  }

  private async checkUnderstandable(): Promise<WCAGCheckResult[]> {
    const results: WCAGCheckResult[] = []

    // 3.1.1 Language of Page (Level A)
    results.push(this.checkLanguageOfPage())
    
    // 3.1.2 Language of Parts (Level AA)
    results.push(this.checkLanguageOfParts())
    
    // 3.2.1 On Focus (Level A)
    results.push(this.checkOnFocus())
    
    // 3.2.2 On Input (Level A)
    results.push(this.checkOnInput())
    
    // 3.2.3 Consistent Navigation (Level AA)
    results.push(this.checkConsistentNavigation())
    
    // 3.2.4 Consistent Identification (Level AA)
    results.push(this.checkConsistentIdentification())
    
    // 3.3.1 Error Identification (Level A)
    results.push(this.checkErrorIdentification())
    
    // 3.3.2 Labels or Instructions (Level A)
    results.push(this.checkLabelsOrInstructions())
    
    // 3.3.3 Error Suggestion (Level AA)
    results.push(this.checkErrorSuggestion())
    
    // 3.3.4 Error Prevention (Legal, Financial, Data) (Level AA)
    results.push(this.checkErrorPrevention())

    return results
  }

  private async checkRobust(): Promise<WCAGCheckResult[]> {
    const results: WCAGCheckResult[] = []

    // 4.1.1 Parsing (Level A)
    results.push(this.checkParsing())
    
    // 4.1.2 Name, Role, Value (Level A)
    results.push(this.checkNameRoleValue())
    
    // 4.1.3 Status Messages (Level AA)
    results.push(this.checkStatusMessages())

    return results
  }

  // Perceivable checks implementation
  private checkNonTextContent(): WCAGCheckResult {
    const images = Array.from(this.document.querySelectorAll('img'))
    const failedImages: Element[] = []
    
    images.forEach(img => {
      const alt = img.getAttribute('alt')
      const role = img.getAttribute('role')
      const ariaLabel = img.getAttribute('aria-label')
      const isDecorative = role === 'presentation' || alt === ''
      
      if (!isDecorative && !alt && !ariaLabel) {
        failedImages.push(img)
      }
    })

    return {
      id: '1.1.1',
      guideline: 'Non-text Content',
      level: 'A',
      status: failedImages.length > 0 ? 'fail' : 'pass',
      description: 'All non-text content has a text alternative',
      impact: 'high',
      elements: failedImages,
      recommendation: failedImages.length > 0 ? 'Add alt text to images or mark decorative images with alt=""' : undefined
    }
  }

  private checkMediaAlternatives(): WCAGCheckResult {
    const videos = Array.from(this.document.querySelectorAll('video, audio'))
    const missingAlternatives: Element[] = []
    
    videos.forEach(media => {
      const hasControls = media.hasAttribute('controls')
      const hasTranscript = this.document.querySelector(`[aria-describedby="${media.id}"]`)
      const hasCaptions = media.querySelector('track[kind="captions"]')
      
      if (!hasTranscript && !hasCaptions) {
        missingAlternatives.push(media)
      }
    })

    return {
      id: '1.2.1',
      guideline: 'Audio-only and Video-only (Prerecorded)',
      level: 'A',
      status: videos.length === 0 ? 'pass' : (missingAlternatives.length > 0 ? 'manual' : 'pass'),
      description: 'Prerecorded audio-only and video-only content has alternatives',
      impact: 'medium',
      elements: missingAlternatives,
      recommendation: 'Provide transcripts for audio content and audio descriptions for video content'
    }
  }

  private checkInfoAndRelationships(): WCAGCheckResult {
    const issues: Element[] = []
    
    // Check form labels
    const inputs = Array.from(this.document.querySelectorAll('input, select, textarea'))
    inputs.forEach(input => {
      const id = input.getAttribute('id')
      const ariaLabel = input.getAttribute('aria-label')
      const ariaLabelledby = input.getAttribute('aria-labelledby')
      const label = id ? this.document.querySelector(`label[for="${id}"]`) : null
      
      if (!label && !ariaLabel && !ariaLabelledby) {
        issues.push(input)
      }
    })
    
    // Check heading hierarchy
    const headings = Array.from(this.document.querySelectorAll('h1, h2, h3, h4, h5, h6'))
    let previousLevel = 0
    
    headings.forEach(heading => {
      const level = parseInt(heading.tagName.charAt(1))
      if (level > previousLevel + 1) {
        issues.push(heading)
      }
      previousLevel = level
    })

    return {
      id: '1.3.1',
      guideline: 'Info and Relationships',
      level: 'A',
      status: issues.length > 0 ? 'fail' : 'pass',
      description: 'Information and relationships are preserved in markup',
      impact: 'high',
      elements: issues,
      recommendation: 'Ensure proper form labels and heading hierarchy'
    }
  }

  private checkMeaningfulSequence(): WCAGCheckResult {
    // This is primarily a manual check, but we can detect some issues
    const tabIndexElements = Array.from(this.document.querySelectorAll('[tabindex]'))
    const negativeTabIndex = tabIndexElements.filter(el => {
      const tabIndex = parseInt(el.getAttribute('tabindex') || '0')
      return tabIndex > 0
    })

    return {
      id: '1.3.2',
      guideline: 'Meaningful Sequence',
      level: 'A',
      status: negativeTabIndex.length > 0 ? 'warning' : 'manual',
      description: 'Content is presented in a meaningful sequence',
      impact: 'medium',
      elements: negativeTabIndex,
      recommendation: 'Avoid positive tabindex values and ensure logical content order'
    }
  }

  private checkSensoryCharacteristics(): WCAGCheckResult {
    // Manual check - need to review content for sensory-only instructions
    return {
      id: '1.3.3',
      guideline: 'Sensory Characteristics',
      level: 'A',
      status: 'manual',
      description: 'Instructions do not rely solely on sensory characteristics',
      impact: 'medium',
      recommendation: 'Manually review that instructions don\'t rely only on shape, size, visual location, orientation, or sound'
    }
  }

  private checkUseOfColor(): WCAGCheckResult {
    // This requires manual review, but we can check for common patterns
    const colorOnlyElements = Array.from(this.document.querySelectorAll('.text-red-500, .text-green-500, .text-yellow-500'))
      .filter(el => {
        const text = el.textContent?.toLowerCase() || ''
        return text.includes('error') || text.includes('success') || text.includes('warning')
      })

    return {
      id: '1.4.1',
      guideline: 'Use of Color',
      level: 'A',
      status: 'manual',
      description: 'Color is not used as the only visual means of conveying information',
      impact: 'medium',
      recommendation: 'Ensure color is not the only way to convey information'
    }
  }

  private checkAudioControl(): WCAGCheckResult {
    const autoPlayAudio = Array.from(this.document.querySelectorAll('audio[autoplay], video[autoplay]'))
      .filter(media => !media.hasAttribute('muted'))

    return {
      id: '1.4.2',
      guideline: 'Audio Control',
      level: 'A',
      status: autoPlayAudio.length > 0 ? 'fail' : 'pass',
      description: 'Auto-playing audio can be paused or stopped',
      impact: 'medium',
      elements: autoPlayAudio,
      recommendation: 'Provide controls to pause or stop auto-playing audio'
    }
  }

  private async checkContrastMinimum(): Promise<WCAGCheckResult> {
    // This would require color analysis - simplified check
    const elements = Array.from(this.document.querySelectorAll('*'))
    const lowContrastElements: Element[] = []
    
    // In a real implementation, you'd calculate actual contrast ratios
    // For now, we'll do a basic check for common low-contrast patterns
    elements.forEach(el => {
      const styles = window.getComputedStyle(el)
      const color = styles.color
      const backgroundColor = styles.backgroundColor
      
      // Basic heuristic for potentially problematic combinations
      if (color === 'rgb(128, 128, 128)' && backgroundColor === 'rgb(255, 255, 255)') {
        lowContrastElements.push(el)
      }
    })

    return {
      id: '1.4.3',
      guideline: 'Contrast (Minimum)',
      level: 'AA',
      status: 'manual',
      description: 'Text has sufficient contrast ratio (4.5:1 for normal text, 3:1 for large text)',
      impact: 'high',
      recommendation: 'Use contrast checking tools to verify all text meets minimum contrast requirements'
    }
  }

  private checkResizeText(): WCAGCheckResult {
    // Check for viewport meta tag that prevents zooming
    const viewport = this.document.querySelector('meta[name="viewport"]')
    const viewportContent = viewport?.getAttribute('content') || ''
    const preventsZoom = viewportContent.includes('user-scalable=no') || 
                        viewportContent.includes('maximum-scale=1')

    return {
      id: '1.4.4',
      guideline: 'Resize text',
      level: 'AA',
      status: preventsZoom ? 'fail' : 'pass',
      description: 'Text can be resized up to 200% without loss of content or functionality',
      impact: 'high',
      recommendation: preventsZoom ? 'Remove user-scalable=no from viewport meta tag' : undefined
    }
  }

  private checkImagesOfText(): WCAGCheckResult {
    // Manual check required
    return {
      id: '1.4.5',
      guideline: 'Images of Text',
      level: 'AA',
      status: 'manual',
      description: 'Images of text are avoided unless essential',
      impact: 'medium',
      recommendation: 'Manually verify that images containing text are essential and cannot be replaced with actual text'
    }
  }

  // Operable checks implementation
  private checkKeyboardAccessible(): WCAGCheckResult {
    const interactiveElements = Array.from(this.document.querySelectorAll('button, a, input, select, textarea, [role="button"], [role="link"], [role="tab"]'))
    const nonFocusableElements = interactiveElements.filter(el => {
      const tabIndex = el.getAttribute('tabindex')
      return tabIndex === '-1' && !el.hasAttribute('disabled')
    })

    return {
      id: '2.1.1',
      guideline: 'Keyboard',
      level: 'A',
      status: nonFocusableElements.length > 0 ? 'fail' : 'pass',
      description: 'All functionality is available from a keyboard',
      impact: 'critical',
      elements: nonFocusableElements,
      recommendation: 'Ensure all interactive elements are keyboard accessible'
    }
  }

  private checkNoKeyboardTrap(): WCAGCheckResult {
    // This requires dynamic testing - manual check
    return {
      id: '2.1.2',
      guideline: 'No Keyboard Trap',
      level: 'A',
      status: 'manual',
      description: 'Keyboard focus is not trapped in any part of the content',
      impact: 'critical',
      recommendation: 'Manually test that keyboard focus can move freely through all content'
    }
  }

  private checkCharacterKeyShortcuts(): WCAGCheckResult {
    // Check for potential character key shortcuts
    const elementsWithAccesskey = Array.from(this.document.querySelectorAll('[accesskey]'))
    
    return {
      id: '2.1.4',
      guideline: 'Character Key Shortcuts',
      level: 'A',
      status: elementsWithAccesskey.length > 0 ? 'manual' : 'pass',
      description: 'Character key shortcuts can be turned off or remapped',
      impact: 'medium',
      elements: elementsWithAccesskey,
      recommendation: 'Ensure character key shortcuts can be disabled or remapped'
    }
  }

  private checkTimingAdjustable(): WCAGCheckResult {
    // Check for meta refresh
    const metaRefresh = this.document.querySelector('meta[http-equiv="refresh"]')
    
    return {
      id: '2.2.1',
      guideline: 'Timing Adjustable',
      level: 'A',
      status: metaRefresh ? 'manual' : 'pass',
      description: 'Time limits can be turned off, adjusted, or extended',
      impact: 'high',
      recommendation: 'Ensure users can control time limits'
    }
  }

  private checkPauseStopHide(): WCAGCheckResult {
    const movingContent = Array.from(this.document.querySelectorAll('[autoplay], .animate-spin, .animate-pulse'))
    
    return {
      id: '2.2.2',
      guideline: 'Pause, Stop, Hide',
      level: 'A',
      status: movingContent.length > 0 ? 'manual' : 'pass',
      description: 'Moving, blinking, or auto-updating content can be paused, stopped, or hidden',
      impact: 'medium',
      elements: movingContent,
      recommendation: 'Provide controls to pause or stop moving content'
    }
  }

  private checkThreeFlashes(): WCAGCheckResult {
    // Requires manual review for flashing content
    return {
      id: '2.3.1',
      guideline: 'Three Flashes or Below Threshold',
      level: 'A',
      status: 'manual',
      description: 'Content does not flash more than three times per second',
      impact: 'critical',
      recommendation: 'Manually verify no content flashes more than 3 times per second'
    }
  }

  private checkBypassBlocks(): WCAGCheckResult {
    const skipLinks = Array.from(this.document.querySelectorAll('a[href^="#"]'))
      .filter(link => link.textContent?.toLowerCase().includes('skip'))
    
    const hasSkipLink = skipLinks.length > 0
    const hasLandmarks = this.document.querySelectorAll('main, nav, [role="main"], [role="navigation"]').length > 0

    return {
      id: '2.4.1',
      guideline: 'Bypass Blocks',
      level: 'A',
      status: (hasSkipLink || hasLandmarks) ? 'pass' : 'fail',
      description: 'A mechanism is available to bypass blocks of content',
      impact: 'high',
      recommendation: 'Add skip links or use proper landmark elements'
    }
  }

  private checkPageTitled(): WCAGCheckResult {
    const title = this.document.querySelector('title')
    const titleText = title?.textContent?.trim() || ''
    
    return {
      id: '2.4.2',
      guideline: 'Page Titled',
      level: 'A',
      status: titleText.length > 0 ? 'pass' : 'fail',
      description: 'Web pages have titles that describe topic or purpose',
      impact: 'medium',
      recommendation: titleText.length === 0 ? 'Add a descriptive page title' : undefined
    }
  }

  private checkFocusOrder(): WCAGCheckResult {
    // This requires manual testing
    return {
      id: '2.4.3',
      guideline: 'Focus Order',
      level: 'A',
      status: 'manual',
      description: 'Focusable components receive focus in an order that preserves meaning',
      impact: 'medium',
      recommendation: 'Manually test that focus order follows logical sequence'
    }
  }

  private checkLinkPurpose(): WCAGCheckResult {
    const links = Array.from(this.document.querySelectorAll('a[href]'))
    const vagueLinkTexts = ['click here', 'read more', 'here', 'more', 'link']
    const vagueLinks = links.filter(link => {
      const text = link.textContent?.toLowerCase().trim() || ''
      const ariaLabel = link.getAttribute('aria-label')
      const title = link.getAttribute('title')
      
      return vagueLinkTexts.includes(text) && !ariaLabel && !title
    })

    return {
      id: '2.4.4',
      guideline: 'Link Purpose (In Context)',
      level: 'A',
      status: vagueLinks.length > 0 ? 'fail' : 'pass',
      description: 'The purpose of each link can be determined from the link text alone',
      impact: 'medium',
      elements: vagueLinks,
      recommendation: 'Make link text descriptive or add aria-label for context'
    }
  }

  private checkMultipleWays(): WCAGCheckResult {
    // Check for search, sitemap, or navigation
    const hasSearch = this.document.querySelector('input[type="search"], [role="search"]')
    const hasNavigation = this.document.querySelector('nav, [role="navigation"]')
    const hasSitemap = this.document.querySelector('a[href*="sitemap"]')
    
    const ways = [hasSearch, hasNavigation, hasSitemap].filter(Boolean).length

    return {
      id: '2.4.5',
      guideline: 'Multiple Ways',
      level: 'AA',
      status: ways >= 2 ? 'pass' : 'manual',
      description: 'More than one way is available to locate a web page',
      impact: 'medium',
      recommendation: 'Provide multiple ways to find content (search, navigation, sitemap)'
    }
  }

  private checkHeadingsAndLabels(): WCAGCheckResult {
    const headings = Array.from(this.document.querySelectorAll('h1, h2, h3, h4, h5, h6'))
    const emptyHeadings = headings.filter(h => !h.textContent?.trim())
    
    const labels = Array.from(this.document.querySelectorAll('label'))
    const emptyLabels = labels.filter(l => !l.textContent?.trim())

    const issues = [...emptyHeadings, ...emptyLabels]

    return {
      id: '2.4.6',
      guideline: 'Headings and Labels',
      level: 'AA',
      status: issues.length > 0 ? 'fail' : 'pass',
      description: 'Headings and labels describe topic or purpose',
      impact: 'medium',
      elements: issues,
      recommendation: 'Ensure all headings and labels are descriptive and not empty'
    }
  }

  private checkFocusVisible(): WCAGCheckResult {
    // Check if focus styles are disabled
    const styleSheets = Array.from(this.document.styleSheets)
    let focusOutlineDisabled = false
    
    try {
      styleSheets.forEach(sheet => {
        const rules = Array.from(sheet.cssRules || [])
        rules.forEach(rule => {
          if (rule instanceof CSSStyleRule && rule.selectorText?.includes(':focus')) {
            if (rule.style.outline === 'none' || rule.style.outline === '0') {
              focusOutlineDisabled = true
            }
          }
        })
      })
    } catch (e) {
      // CORS or other access issues with stylesheets
    }

    return {
      id: '2.4.7',
      guideline: 'Focus Visible',
      level: 'AA',
      status: focusOutlineDisabled ? 'warning' : 'manual',
      description: 'Any keyboard operable user interface has a mode of operation where the keyboard focus indicator is visible',
      impact: 'high',
      recommendation: 'Ensure focus indicators are visible and not disabled with outline: none'
    }
  }

  // Understandable checks
  private checkLanguageOfPage(): WCAGCheckResult {
    const htmlLang = this.document.documentElement.getAttribute('lang')
    
    return {
      id: '3.1.1',
      guideline: 'Language of Page',
      level: 'A',
      status: htmlLang ? 'pass' : 'fail',
      description: 'The default human language of each web page can be programmatically determined',
      impact: 'medium',
      recommendation: htmlLang ? undefined : 'Add lang attribute to html element'
    }
  }

  private checkLanguageOfParts(): WCAGCheckResult {
    // Check for content in different languages
    const langElements = Array.from(this.document.querySelectorAll('[lang]'))
    
    return {
      id: '3.1.2',
      guideline: 'Language of Parts',
      level: 'AA',
      status: 'manual',
      description: 'The human language of each passage can be programmatically determined',
      impact: 'low',
      recommendation: 'Identify language changes in content with lang attribute'
    }
  }

  private checkOnFocus(): WCAGCheckResult {
    // Manual check required
    return {
      id: '3.2.1',
      guideline: 'On Focus',
      level: 'A',
      status: 'manual',
      description: 'When any component receives focus, it does not initiate a change of context',
      impact: 'medium',
      recommendation: 'Manually verify focus does not trigger unexpected context changes'
    }
  }

  private checkOnInput(): WCAGCheckResult {
    // Manual check required
    return {
      id: '3.2.2',
      guideline: 'On Input',
      level: 'A',
      status: 'manual',
      description: 'Changing the setting of any user interface component does not automatically cause a change of context',
      impact: 'medium',
      recommendation: 'Manually verify input changes do not trigger unexpected context changes'
    }
  }

  private checkConsistentNavigation(): WCAGCheckResult {
    // Manual check required across pages
    return {
      id: '3.2.3',
      guideline: 'Consistent Navigation',
      level: 'AA',
      status: 'manual',
      description: 'Navigational mechanisms are in the same relative order on multiple pages',
      impact: 'medium',
      recommendation: 'Manually verify navigation is consistent across pages'
    }
  }

  private checkConsistentIdentification(): WCAGCheckResult {
    // Manual check required
    return {
      id: '3.2.4',
      guideline: 'Consistent Identification',
      level: 'AA',
      status: 'manual',
      description: 'Components with the same functionality are identified consistently',
      impact: 'medium',
      recommendation: 'Manually verify consistent component identification'
    }
  }

  private checkErrorIdentification(): WCAGCheckResult {
    const forms = Array.from(this.document.querySelectorAll('form'))
    const hasErrorHandling = forms.some(form => 
      form.querySelector('[role="alert"], .error, [aria-invalid="true"]')
    )

    return {
      id: '3.3.1',
      guideline: 'Error Identification',
      level: 'A',
      status: forms.length === 0 ? 'pass' : 'manual',
      description: 'If an input error is automatically detected, the item that is in error is identified',
      impact: 'high',
      recommendation: 'Ensure form errors are clearly identified and announced to screen readers'
    }
  }

  private checkLabelsOrInstructions(): WCAGCheckResult {
    const inputs = Array.from(this.document.querySelectorAll('input, select, textarea'))
    const missingLabels = inputs.filter(input => {
      const id = input.getAttribute('id')
      const ariaLabel = input.getAttribute('aria-label')
      const ariaLabelledby = input.getAttribute('aria-labelledby')
      const label = id ? this.document.querySelector(`label[for="${id}"]`) : null
      
      return !label && !ariaLabel && !ariaLabelledby
    })

    return {
      id: '3.3.2',
      guideline: 'Labels or Instructions',
      level: 'A',
      status: missingLabels.length > 0 ? 'fail' : 'pass',
      description: 'Labels or instructions are provided when content requires user input',
      impact: 'high',
      elements: missingLabels,
      recommendation: 'Provide clear labels and instructions for all form inputs'
    }
  }

  private checkErrorSuggestion(): WCAGCheckResult {
    // Manual check required
    return {
      id: '3.3.3',
      guideline: 'Error Suggestion',
      level: 'AA',
      status: 'manual',
      description: 'If an input error is automatically detected and suggestions for correction are known, the suggestions are provided',
      impact: 'medium',
      recommendation: 'Provide helpful error messages with correction suggestions'
    }
  }

  private checkErrorPrevention(): WCAGCheckResult {
    // Manual check required
    return {
      id: '3.3.4',
      guideline: 'Error Prevention (Legal, Financial, Data)',
      level: 'AA',
      status: 'manual',
      description: 'For forms that cause legal commitments or financial transactions, submissions are reversible, checked, or confirmed',
      impact: 'high',
      recommendation: 'Implement confirmation steps for critical form submissions'
    }
  }

  // Robust checks
  private checkParsing(): WCAGCheckResult {
    // Basic HTML validation check
    const duplicateIds = this.findDuplicateIds()
    const unclosedTags = this.findUnclosedTags()
    
    const issues = [...duplicateIds, ...unclosedTags]

    return {
      id: '4.1.1',
      guideline: 'Parsing',
      level: 'A',
      status: issues.length > 0 ? 'fail' : 'pass',
      description: 'Content can be parsed unambiguously',
      impact: 'medium',
      elements: issues,
      recommendation: 'Fix HTML validation errors'
    }
  }

  private checkNameRoleValue(): WCAGCheckResult {
    const customElements = Array.from(this.document.querySelectorAll('[role]'))
    const missingAttributes = customElements.filter(el => {
      const role = el.getAttribute('role')
      const ariaLabel = el.getAttribute('aria-label')
      const ariaLabelledby = el.getAttribute('aria-labelledby')
      
      // Check if interactive roles have accessible names
      const interactiveRoles = ['button', 'link', 'checkbox', 'radio', 'textbox']
      if (interactiveRoles.includes(role || '')) {
        return !ariaLabel && !ariaLabelledby && !el.textContent?.trim()
      }
      
      return false
    })

    return {
      id: '4.1.2',
      guideline: 'Name, Role, Value',
      level: 'A',
      status: missingAttributes.length > 0 ? 'fail' : 'pass',
      description: 'For all user interface components, the name and role can be programmatically determined',
      impact: 'high',
      elements: missingAttributes,
      recommendation: 'Ensure all UI components have accessible names and proper roles'
    }
  }

  private checkStatusMessages(): WCAGCheckResult {
    const statusElements = Array.from(this.document.querySelectorAll('[role="status"], [role="alert"], [aria-live]'))
    
    return {
      id: '4.1.3',
      guideline: 'Status Messages',
      level: 'AA',
      status: 'manual',
      description: 'Status messages can be programmatically determined through role or properties',
      impact: 'medium',
      elements: statusElements,
      recommendation: 'Ensure status messages use appropriate ARIA roles and live regions'
    }
  }

  // Helper methods
  private findDuplicateIds(): Element[] {
    const ids = new Set<string>()
    const duplicates: Element[] = []
    
    Array.from(this.document.querySelectorAll('[id]')).forEach(el => {
      const id = el.getAttribute('id')!
      if (ids.has(id)) {
        duplicates.push(el)
      }
      ids.add(id)
    })
    
    return duplicates
  }

  private findUnclosedTags(): Element[] {
    // Simplified check - in practice, you'd need more sophisticated HTML parsing
    return []
  }

  private compileResults(results: WCAGCheckResult[]): AccessibilityAuditResult {
    const passed = results.filter(r => r.status === 'pass').length
    const failed = results.filter(r => r.status === 'fail').length
    const warnings = results.filter(r => r.status === 'warning').length
    const manual = results.filter(r => r.status === 'manual').length
    
    const score = Math.round((passed / (passed + failed)) * 100)
    
    return {
      score,
      totalChecks: results.length,
      passed,
      failed,
      warnings,
      manual,
      results,
      summary: {
        perceivable: results.filter(r => r.id.startsWith('1.')),
        operable: results.filter(r => r.id.startsWith('2.')),
        understandable: results.filter(r => r.id.startsWith('3.')),
        robust: results.filter(r => r.id.startsWith('4.'))
      }
    }
  }
}

export const wcagAuditor = new WCAGAuditor()

// Convenience function for quick audits
export async function performQuickAccessibilityAudit(): Promise<AccessibilityAuditResult> {
  return await wcagAuditor.performAudit()
}
