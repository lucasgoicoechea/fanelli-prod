const authorize = (...args) => {
  return 'SUPERADMIN|' + args.join('|')
}

export default authorize
