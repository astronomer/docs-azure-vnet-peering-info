---
sidebar_label: "AWS"
title: "Resources required for Astro on AWS"
id: resource-reference-aws
description: Reference of all supported configurations for new clusters on Astro in AWS.
sidebar_custom_props: { icon: "img/aws.png" }
---

Unless otherwise specified, new clusters on Astro are created with a set of default AWS resources that should be suitable for most use cases.

Read the following document for a reference of our default resources as well as supported cluster configurations, including **AWS Region** and **Node Instance Type**.

## Default cluster values

| Resource                                                                                            | Description                                                                                                                                                                                                                                                                                                          | Quantity / Default Size                       |
| --------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| [EKS Cluster](https://aws.amazon.com/eks)                                                           | An EKS cluster is required to run the Astro Data Plane, which hosts the resources and data required to execute Airflow tasks.                                                                                                                                                                                        | 1x                                            |
| Worker node pool                                                                                    | A node pool of [EC2 instances](https://aws.amazon.com/ec2/instance-types/) that run all workers across Deployments in the cluster. The number of nodes in the pool auto-scales based on the demand for workers in your cluster. You can configure multiple worker node pools to run tasks on different worker types. | 1x pool of m5.xlarge nodes                    |
| Airflow system node pool                                                                            | A node pool of [EC2 instances](https://aws.amazon.com/ec2/instance-types/) that runs all core Airflow components, including the scheduler and webserver. This node pool is fully managed by Astronomer                                                                                                               | 1x pool of m5.xlarge nodes                    |
| Astro system node pool                                                                              | A node pool of [EC2 instances](https://aws.amazon.com/ec2/instance-types/) that runs all other system components required in Astro. This node pool is fully managed by Astronomer                                                                                                                                    | 1x pool of m5.xlarge nodes                    |
| [RDS for PostgreSQL Instance](https://aws.amazon.com/rds/)                                          | The RDS instance is the primary database of the Astro Data Plane. It hosts a metadata database for each Airflow Deployment hosted on the EKS cluster.                                                                                                                                                                | 1x db.r5.large                                |
| [Elastic IPs](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/elastic-ip-addresses-eip.html)    | Elastic IPs are required for connectivity with the Control Plane, and other public services.                                                                                                                                                                                                                         | 2x                                            |
| [Subnets](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Subnets.html)                        | Subnets are provisioned in 2 different [Availability Zones (AZs)](https://aws.amazon.com/about-aws/global-infrastructure/regions_az/) for redundancy, with 1 public and 1 private subnet per AZ. Public subnets are required for the NAT and Internet gateways, while private subnets are required for EC2 nodes.    | 2x /26 (public) and 1x /20 + 1x /21 (private) |
| [Internet Gateway](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Internet_Gateway.html)      | Required for connectivity with the control plane and other public services.                                                                                                                                                                                                                                          | 1x                                            |
| [NAT Gateways](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html)               | NAT Gateways translate outbound traffic from private subnets to public subnets.                                                                                                                                                                                                                                      | 2x                                            |
| [Routes](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Route_Tables.html#route-table-routes) | Routes are necessary to direct network traffic from the subnets and gateways.                                                                                                                                                                                                                                        | 2x                                            |
| [Route Tables](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Route_Tables.html)              | Home for the routes.                                                                                                                                                                                                                                                                                                 | 2x                                            |
| [VPC](https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html)                     | Virtual network for launching and hosting AWS resources.                                                                                                                                                                                                                                                             | 1x /19                                        |
| [S3](https://docs.aws.amazon.com/AmazonS3/latest/userguide//Welcome.html)                           | S3 bucket for storage of Airflow task logs.                                                                                                                                                                                                                                                                          | 1x                                            |
| Maximum Node Count                                                                                  | The maximum number of EC2 nodes that your Astro cluster can support. When this limit is reached, your cluster can't auto-scale and worker Pods may fail to schedule.                                                                                                                                                 | 20                                            |

## Supported cluster configurations

You might need to modify configurations of a new or existing cluster on Astro. This section provides a reference for cluster configuration options.

To create a new cluster on Astro with a specified configuration, see [Create a cluster](create-cluster.md). To request a change to an existing Cluster, see [Modify a cluster](modify-cluster.md). Astronomer is currently responsible for completing all cluster configuration changes.

### AWS region

Astro supports the following AWS regions:

- `af-south-1` - Africa (Cape Town)
- `ap-east-1` - Asia Pacific (Hong Kong)
- `ap-northeast-1` - Asia Pacific (Tokyo)
- `ap-northeast-2` - Asia Pacific (Seoul)
- `ap-northeast-3` - Asia Pacific (Osaka)
- `ap-southeast-1` - Asia Pacific (Singapore)
- `ap-southeast-2` - Asia Pacific (Sydney)
- `ap-south-1` - Asia Pacific (Mumbai)
- `ca-central-1` - Canada (Central)
- `eu-central-1` - Europe (Frankfurt)
- `eu-north-1` - Europe (Stockholm)
- `eu-south-1` - Europe (Milan)
- `eu-west-1` - Europe (Ireland)
- `eu-west-2` - Europe (London)
- `eu-west-3` - Europe (Paris)
- `me-south-1` - Middle East (Bahrain)
- `sa-east-1` - South America (São Paulo)
- `us-east-1` - US East (N. Virginia)
- `us-east-2` - US East (Ohio)
- `us-west-1` - US West (N. California)
- `us-west-2` - US West (Oregon)

Modifying the region of an existing cluster on Astro is not supported. If you're interested in an AWS region that is not on this list, reach out to [Astronomer support](https://cloud.astronomer.io/support).

### RDS instance type

Every Astro cluster on AWS is created with and requires an [RDS instance](https://aws.amazon.com/rds/). RDS serves as a primary relational database for the data plane and powers the metadata database of each Astro Deployment within a single cluster. During the cluster creation process, you'll be asked to specify an RDS instance type according to your use case and expected workload, but it can be modified at any time.

Astro supports a variety of AWS RDS instance types. Instance types comprise of varying combinations of CPU, memory, storage, and networking capacity. For detailed information on each instance type, reference [AWS documentation](https://aws.amazon.com/rds/instance-types/). If you're interested in an RDS instance type that is not on this list, reach out to [Astronomer support](https://cloud.astronomer.io/support).

#### db.r5

- db.r5.large (_default_)
- db.r5.xlarge
- db.r5.2xlarge
- db.r5.4xlarge
- db.r5.8xlarge
- db.r5.12xlarge
- db.r5.16xlarge
- db.r5.24xlarge

#### db.m5

- db.m5.large
- db.m5.xlarge
- db.m5.2xlarge
- db.m5.4xlarge
- db.m5.8xlarge
- db.m5.12xlarge
- db.m5.16xlarge
- db.m5.24xlarge

### Worker node pools

A node pool is a group of nodes within a cluster that all have the same configuration. On Astro, worker nodes are responsible for running the Pods that execute Airflow tasks. Each worker node pool can be configured with a node instance type and a maximum node count. All Astro clusters have one worker node pool by default, but you can configure additional node pools for advanced configurability.

If your cluster has multiple worker node pools with different worker node instance types, users in your organization can configure tasks to run on those worker types using [worker queues](configure-deployment-resources.md#worker-queues). To enable a new worker type for your cluster, contact [Astronomer support](https://cloud.astronomer.io/support) with a request to create a new node pool or modify an existing node pool.

Astronomer monitors your usage and the number of nodes deployed in your cluster. As your usage of Airflow increases, Astronomer support might contact you and provide recommendations for updating your node pools to optimize your infrastructure spend or increase the efficiency of your tasks.

For information about each instance type, see [Amazon EC2 Instance Types](https://aws.amazon.com/ec2/instance-types/).

### Worker node types

Each worker in a worker node pool runs a single worker Pod. A worker Pod's actual available size is equivalent to the total capacity of the instance type minus Astro’s system overhead.

The following table lists all available instance types for worker node pools, as well as the Pod size that is supported for each instance type. As the system requirements of Astro change, these values can increase or decrease.

| Worker Node Type | CPU     | Memory       |
| ---------------- | ------- | ------------ |
| m5.xlarge        | 3 CPUs  | 13 GiB MEM   |
| m5.2xlarge       | 7 CPUs  | 29 GiB MEM   |
| m5.4xlarge       | 15 CPUs | 61 GiB MEM   |
| m5.8xlarge       | 31 CPUs | 125 GiB MEM  |
| m5.12xlarge      | 47 CPUs | 189 GiB MEM  |
| m5.16xlarge      | 63 CPUs | 253 GiB MEM  |
| m5.24xlarge      | 95 CPUs | 381 GiB MEM  |
| m5.metal         | 95 CPUs | 381 GiB MEM  |
| m5d.xlarge       | 3 CPUs  | 13 GiB MEM   |
| m5d.2xlarge      | 7 CPUs  | 29 GiB MEM   |
| m5d.4xlarge      | 15 CPUs | 61 GiB MEM   |
| m5d.8xlarge      | 31 CPUs | 125 GiB MEM  |
| m5d.12xlarge     | 47 CPUs | 189 GiB MEM  |
| m5d.16xlarge     | 63 CPUs | 253 GiB MEM  |
| m5d.24xlarge     | 95 CPUs | 381 GiB MEM  |
| m5d.metal        | 95 CPUs | 381 GiB MEM  |
| m6i.xlarge       | 3 CPUs  | 13 GiB MEM   |
| m61.2xlarge      | 7 CPUs  | 29 GiB MEM   |
| m6i.4xlarge      | 15 CPUs | 61 GiB MEM   |
| m6i.8xlarge      | 31 CPUs | 125 GiB MEM  |
| m6i.12xlarge     | 47 CPUs | 189 GiB MEM  |
| m6i.16xlarge     | 63 CPUs | 253 GiB MEM  |
| m6i.24xlarge     | 95 CPUs | 381 GiB MEM  |
| m6i.metal        | 95 CPUs | 381 GiB MEM  |
| m6id.xlarge      | 3 CPUs  | 13 GiB MEM   |
| m61d.2xlarge     | 7 CPUs  | 29 GiB MEM   |
| m6id.4xlarge     | 15 CPU  | 61 GiB MEM   |
| m6id.8xlarge     | 31 CPU  | 125 GiB MEM  |
| m6id.12xlarge    | 47 CPU  | 189 GiB MEM  |
| m6id.16xlarge    | 63 CPU  | 253 GiB MEM  |
| m6id.24xlarge    | 95 CPU  | 381 GiB MEM  |
| m6id.metal       | 127 CPU | 509 GiB MEM  |
| r6i.xlarge       | 3 CPUs  | 29 GiB MEM   |
| r61.2xlarge      | 7 CPUs  | 61 GiB MEM   |
| r6i.4xlarge      | 15 CPUs | 125 GiB MEM  |
| r6i.8xlarge      | 31 CPUs | 253 GiB MEM  |
| r6i.12xlarge     | 47 CPUs | 381 GiB MEM  |
| r6i.16xlarge     | 63 CPUs | 509 GiB MEM  |
| r6i.24xlarge     | 95 CPUs | 765 GiB MEM  |
| r6i.metal        | 95 CPUs | 1021 GiB MEM |
| c6i.xlarge       | 3 CPUs  | 5 GiB MEM    |
| c61.2xlarge      | 7 CPUs  | 13 GiB MEM   |
| c6i.4xlarge      | 15 CPUs | 29 GiB MEM   |
| c6i.8xlarge      | 31 CPUs | 61 GiB MEM   |
| c6i.12xlarge     | 47 CPUs | 93 GiB MEM   |
| c6i.16xlarge     | 63 CPUs | 125 GiB MEM  |
| c6i.24xlarge     | 95 CPUs | 189 GiB MEM  |
| c6i.metal        | 95 CPUs | 189 GiB MEM  |
| t3.xlarge        | 3 CPUs  | 13 GiB MEM   |
| t3.2xlarge       | 7 CPUs  | 29 GiB MEM   |

:::info

With the exception of `m5d` nodes, all supported node types have a maximum of 20GB of storage per node for system use only. If you need locally attached storage for task execution, Astronomer recommends modifying your cluster to run `m5d` nodes, which Astronomer provisions with NVMe SSD volumes.

The ability to provision ephemeral storage for all node instance types is coming soon.

If you need to pass significant data between Airflow tasks, Astronomer recommends using an [XCom backend](https://airflow.apache.org/docs/apache-airflow/stable/concepts/xcoms.html) such as [AWS S3](https://aws.amazon.com/s3/) or [Google Cloud Storage (GCS)](https://cloud.google.com/storage). For more information and best practices, see the Airflow Guide on [Passing Data Between Airflow Tasks](https://www.astronomer.io/guides/airflow-passing-data-between-tasks).

:::

### Maximum node count

Each Astro cluster has a limit on how many nodes it can run at once. This maximum includes worker nodes as well as system nodes managed by Astronomer.

The default maximum node count for all nodes across your cluster is 20. A cluster's node count is most affected by the number of worker Pods that are executing Airflow tasks. See [Worker autoscaling logic](configure-deployment-resources.md#worker-autoscaling-logic).

If the node count for your cluster reaches the maximum node count, new tasks might not run or get scheduled. Astronomer monitors maximum node count and is responsible for contacting your organization if it is reached. To check your cluster's current node count, contact [Astronomer Support](https://cloud.astronomer.io/support).
