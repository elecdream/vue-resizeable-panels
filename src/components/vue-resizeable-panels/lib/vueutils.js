export function getChildVueNodes(p) {

  function stepInto(children) {
    let arr = []

    for (let child of children) {
      if (child.component != null) {
        arr.push(child.component);
      }
      else if (child.children != undefined && child.children.length > 0) {
        arr = [...arr, ...stepInto(child.children)]
      }
    }
    return arr
  }

  return stepInto(p.$.subTree.children);
}