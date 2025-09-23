const path = require('path')
const fs = require('fs')

console.log('=== Vila POS System - Path Debug Tool ===')
console.log('')

// Current working directory
console.log('Current Working Directory:', process.cwd())
console.log('Script Directory:', __dirname)
console.log('')

// Check for dist folder and contents
const distPath = path.join(process.cwd(), 'dist')
console.log('Dist Path:', distPath)
console.log('Dist Exists:', fs.existsSync(distPath))

if (fs.existsSync(distPath)) {
  console.log('Dist Contents:')
  try {
    const distContents = fs.readdirSync(distPath)
    distContents.forEach(file => {
      const filePath = path.join(distPath, file)
      const stats = fs.statSync(filePath)
      console.log(`  ${file} ${stats.isDirectory() ? '(directory)' : `(${stats.size} bytes)`}`)
    })
  } catch (error) {
    console.log('  Error reading dist contents:', error.message)
  }
} else {
  console.log('  Dist folder does not exist!')
}

console.log('')

// Check for index.html specifically
const indexPath = path.join(distPath, 'index.html')
console.log('Index.html Path:', indexPath)
console.log('Index.html Exists:', fs.existsSync(indexPath))

if (fs.existsSync(indexPath)) {
  try {
    const stats = fs.statSync(indexPath)
    console.log('Index.html Size:', stats.size, 'bytes')
    
    // Read first 200 characters to verify content
    const content = fs.readFileSync(indexPath, 'utf8')
    console.log('Index.html Preview:')
    console.log(content.substring(0, 200) + '...')
  } catch (error) {
    console.log('Error reading index.html:', error.message)
  }
}

console.log('')

// Check package.json
const packagePath = path.join(process.cwd(), 'package.json')
if (fs.existsSync(packagePath)) {
  try {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'))
    console.log('Package Name:', packageJson.name)
    console.log('Package Version:', packageJson.version)
    console.log('Main Entry:', packageJson.main)
  } catch (error) {
    console.log('Error reading package.json:', error.message)
  }
}

console.log('')
console.log('=== Debug Complete ===')