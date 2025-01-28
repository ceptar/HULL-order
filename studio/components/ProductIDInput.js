import React from 'react'
import { withDocument } from 'part:@sanity/form-builder'
import PatchEvent, { set } from 'part:@sanity/form-builder/patch-event'

class ProductIDInput extends React.Component {
  componentDidMount() {
    const { onChange, document } = this.props
    if (document && document._id) {
      onChange(PatchEvent.from(set(document._id)))
    }
  }

  render() {
    return <div>{this.props.value}</div>
  }
}

export default withDocument(ProductIDInput)