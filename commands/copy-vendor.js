const { copyFileSync, mkdirSync } = require('fs')
const { join } = require('path')

const root = join(__dirname, '..')
const vendorDir = join(root, 'public', 'vendor')
mkdirSync(vendorDir, { recursive: true })

const files = [
  [
    join(root, 'node_modules', '@turbodocx', 'html-to-docx', 'dist', 'html-to-docx.browser.js'),
    join(vendorDir, 'html-to-docx.browser.js'),
  ],
  [
    join(root, 'node_modules', 'html2pdf.js', 'dist', 'html2pdf.bundle.min.js'),
    join(vendorDir, 'html2pdf.bundle.min.js'),
  ],
]

for (const [source, destination] of files) {
  copyFileSync(source, destination)
}
