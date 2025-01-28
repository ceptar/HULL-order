import React from 'react'
import { withDocument } from 'part:@sanity/form-builder'
import PatchEvent, { set } from 'part:@sanity/form-builder/patch-event'

class VariantIDInput extends React.Component {
  componentDidMount() {
    const { onChange, value } = this.props
    if (!value) {
      const uniqueID = `productVariant-${Math.floor(Math.random() * 1e12).toString().padStart(12, '0')}`
      onChange(PatchEvent.from(set(uniqueID)))
    }
  }

  render() {
    return <div>{this.props.value}</div>
  }
}

export default withDocument(VariantIDInput)